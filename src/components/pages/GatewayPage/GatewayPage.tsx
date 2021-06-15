import { GatewayPageOuter } from "./GatewayPageStyles";
import { Container, Card } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";
import React from "react";
import { TransactionPageTitle } from "../TransactionPage/TransactionPageStyles";

export const GatewayPage = () => {
  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();

  return (
    <GatewayPageOuter>
      <Container>
        <TransactionPageTitle>
          <span>Gateway</span>
          <span>{address}</span>
        </TransactionPageTitle>

        <Card>
          <Card.Body>
            <Card.Text style={{ marginTop: "1em" }}>
              Gateway {address}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </GatewayPageOuter>
  );
};
