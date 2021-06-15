import React from "react";
import { ToolList } from "./ToolList";
import { ToolsOuter, ToolsTitle } from "./ToolsStyles";

export const ToolsPage = () => {
  return (
    <ToolsOuter>
      <ToolsTitle>General tools</ToolsTitle>
      <ToolList />
      <br />
      <ToolsTitle>Developer tools</ToolsTitle>
      <ToolList />
    </ToolsOuter>
  );
};
