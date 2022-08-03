import React from "react";

import { classNames } from "../../lib/utils";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    noUnderline?: boolean;
    noArrow?: boolean;
}

export const ExternalLink: React.FC<Props> = ({
    children,
    noUnderline,
    noArrow,
    defaultValue,
    href,
    className,
    ...props
}) => (
    <a
        defaultValue={defaultValue as string[]}
        {...props}
        className={classNames(className, "no-underline group")}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
    >
        {noArrow || !href ? null : <span className="select-none w-4"></span>}
        <span
            className={noUnderline || !href ? "hover:underline" : "underline"}
        >
            {children}
        </span>
        {noArrow || !href ? null : (
            <>
                <span className="select-none"> </span>
                <span className="opacity-0 group-hover:opacity-100 external select-none transition-opacity ease-linear duration-75">
                    →
                </span>
            </>
        )}
    </a>
);
