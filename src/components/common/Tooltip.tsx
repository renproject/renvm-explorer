import Tippy from "@tippyjs/react";
import { PropsWithChildren } from "react";

export const Tooltip: React.FC<
    PropsWithChildren & { tooltip: string; className?: string }
> = ({ tooltip, children, className }) => {
    return (
        <Tippy
            content={
                <div className="border border-gray-200 text-sm bg-gray-100 text-center p-2 rounded-lg">
                    {tooltip}
                </div>
            }
        >
            {children as React.ReactElement<any>}
        </Tippy>
    );
};
