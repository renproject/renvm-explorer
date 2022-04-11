import { PropsWithChildren } from "react";
import { OverlayTrigger, Tooltip as BootstrapTooltip } from "react-bootstrap";

import { ReactComponent as InfoIcon } from "../../images/info.svg";

export const Tooltip: React.FC<PropsWithChildren<{ id: string }>> = ({
  id,
  children,
}) => (
  <OverlayTrigger
    placement={"top"}
    overlay={<BootstrapTooltip id={id}>{children}</BootstrapTooltip>}
  >
    <span>
      <InfoIcon style={{ height: 15, width: 15 }} />
    </span>
  </OverlayTrigger>
);
