import React from "react";
import styled from "styled-components";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    noUnderline?: boolean;
    noArrow?: boolean;
}

const LinkWithArrow = styled.a`
    text-decoration: none !important;

    .underlined {
        text-decoration: underline;
    }

    .no-select {
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }
    .external {
        opacity: 0;
        transition: opacity 50ms linear;
        text-decoration: none;
    }

    &:hover {
        text-decoration: none;
        .underlined {
            text-decoration: underline;
        }
        .external {
            opacity: 1;
            text-decoration: none;
        }
    }
`;

export const ExternalLink: React.FC<Props> = ({
    children,
    noUnderline,
    noArrow,
    defaultValue,
    ...props
}) => (
    <LinkWithArrow
        defaultValue={defaultValue as string[]}
        {...props}
        target="_blank"
        rel="noopener noreferrer"
    >
        {noArrow ? null : <span className="no-select w-4"></span>}
        <span className={noUnderline ? "" : "underlined"}>{children}</span>
        {noArrow ? null : (
            <>
                <span className="no-select"> </span>
                <span className="external no-select">→</span>
            </>
        )}
    </LinkWithArrow>
);
