import { InformationCircleIcon } from "@heroicons/react/outline";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";

import { Spinner } from "../../../components/Spinner";
import { classNames } from "../../../lib/utils";

interface Props
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    // The asynchronous callback.
    onClick: () => Promise<any>;
    // (optional) Whether the onClick should be called automatically.
    callOnMount?: boolean;
    // (optional) Disable the button after onClick has been succesfully called.
    allowOnlyOnce?: boolean;
    children: React.ReactNode | ((calling: boolean) => React.ReactNode);
}

export const AsyncButton = ({
    onClick,
    callOnMount,
    allowOnlyOnce,
    disabled,
    children,
    className,
    ...props
}: Props) => {
    const [calling, setCalling] = useState(false);
    const [callError, setCallError] = useState<Error>();
    const [done, setDone] = useState(false);

    // Here's how we'll keep track of our component's mounted state
    const componentIsMounted = useRef(true);
    useEffect(() => {
        return () => {
            componentIsMounted.current = false;
        };
    }, []);

    const onClickCallback = useCallback(async () => {
        setCalling(true);
        setCallError(undefined);
        try {
            await onClick();
            if (allowOnlyOnce && componentIsMounted.current) {
                setDone(true);
            }
        } catch (error: any) {
            if (componentIsMounted.current) {
                setCallError(error);
            }
            console.error(error);
        }
        if (componentIsMounted.current) {
            setCalling(false);
        }
    }, [allowOnlyOnce, onClick]);

    useEffect(() => {
        if (callOnMount && !disabled && !done && !calling && !callError) {
            onClickCallback();
        }
    }, [callOnMount, disabled, done, calling, onClickCallback, callError]);

    const [rendered, setRendered] = useState(false);
    useEffect(() => {
        setRendered(true);
        if (rendered) {
            ReactTooltip.rebuild();
        }
    }, [rendered]);

    return (
        <>
            <button
                {...props}
                onClick={onClickCallback}
                disabled={disabled || calling || done}
                title={callError?.message}
                className={classNames(
                    "mt-3 inline-flex justify-center rounded-md border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-renblue-500 sm:mt-0 sm:text-sm items-center",
                    calling ? "" : "border shadow-sm hover:bg-gray-50",
                    disabled ? "cursor-not-allowed opacity-75" : "",
                    className,
                )}
            >
                {done ? <span>Done -&nbsp;</span> : null}
                <span style={{ display: callError ? "inline" : "none" }}>
                    Error{" "}
                    <span
                        // className="text-t-600"
                        data-tip={callError?.message || "error"}
                    >
                        <InformationCircleIcon className="w-4 -mt-0.5 inline" />
                    </span>
                    &nbsp;-&nbsp;
                </span>
                {calling ? <Spinner /> : null}
                <div className="flex flex-row items-center">
                    {typeof children === "function"
                        ? children(calling)
                        : children}
                </div>
            </button>
        </>
    );
};
