import { useCallback, useEffect, useRef } from "react";

export const classNames = (...classes: Array<string | undefined>) =>
    classes.filter(Boolean).join(" ");

export const useIsMounted = () => {
    const isMountedRef = useRef<boolean>(false);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return useCallback((): boolean => {
        // Return whether the ref is current or not.
        return isMountedRef.current;
    }, [isMountedRef]);
};
