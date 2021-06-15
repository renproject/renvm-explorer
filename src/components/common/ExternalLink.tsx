import React from "react";
import styled from "styled-components";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const LinkWithArrow = styled.a`
  text-decoration: underline;

  &:hover {
    text-decoration: underline !important;
  }
`;

export const ExternalLink: React.FC<Props> = ({
  children,
  defaultValue,
  ...props
}) => (
  <LinkWithArrow
    defaultValue={defaultValue as string[]}
    {...props}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </LinkWithArrow>
);
