import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import styled from "styled-components";

const Tag = styled.span`
  padding: 5px;
  background: #eee;
  font-family: monospace;
  & + span {
    margin-left: 5px;
  }
`;

const ToolCard = ({
  title,
  description,
  tags,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  tags: string[];
}) => {
  return (
    <LinkContainer
      to="/tools"
      style={{ minWidth: "15rem", maxWidth: "15rem", cursor: "pointer" }}
    >
      <Card border="dark">
        <Card.Header>
          <Card.Title style={{ marginBottom: 0 }}>{title}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text>{description}</Card.Text>
          <span>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </span>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
};

export const ToolList = () => {
  return (
    <Row xs={1} md={2} className="g-4">
      <Col>
        <ToolCard
          title={<>pack.encode and pack.decode</>}
          description={<>Convert between pack-encoded values and JSON</>}
          tags={["pack"]}
        />
        <ToolCard
          title={<>Tool title</>}
          description={<>Tool that helps out someway</>}
          tags={["Tag 1", "Tag 2"]}
        />
      </Col>
    </Row>
  );
};
