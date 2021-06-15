import React from "react";
import styled from "styled-components";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const BoxOuter = styled.div`
  background: #eee;
  width: 100%;
  padding: 20px;
`;

export const Box: React.FC<Props> = ({ children, defaultValue, ...props }) => (
  <BoxOuter {...props}>{children}</BoxOuter>
);
