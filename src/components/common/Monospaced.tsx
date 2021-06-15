import React from "react";
import styled from "styled-components";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {}

const MonospacedOuter = styled.span`
  font-family: monospace;
  padding: 6px;
  background: #f5f5f5;
  border-radius: 4px;
  color: #001732;
  margin: 0 5px;
`;

export const Monospaced: React.FC<Props> = ({
  children,
  defaultValue,
  ...props
}) => <MonospacedOuter {...props}>{children}</MonospacedOuter>;
