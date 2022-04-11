import React, { useCallback, useRef } from "react";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { titleCase } from "title-case";

import { RenNetwork } from "@renproject/utils";

import { UIContainer } from "../../containers/UIContainer";
import { NETWORK } from "../../environmentVariables";
import { ReactComponent as Logo } from "../../images/logo.svg";
import { ExternalLink } from "../common/ExternalLink";
import {
    CollapseStyled,
    HeaderLogo,
    NavbarStyled,
    SearchButton,
    SearchInputStyled,
    SearchRow,
} from "./HeaderStyles";

export const Header = () => {
  const { handleSearchForm } = UIContainer.useContainer();

  const searchFormInputRef = useRef<HTMLInputElement | null>(null);
  const searchFormSubmitCallback = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!searchFormInputRef.current) {
        return;
      }

      const searchInput = searchFormInputRef.current.value;

      handleSearchForm(searchInput);
    },
    [searchFormInputRef, handleSearchForm]
  );

  return (
    <NavbarStyled bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <HeaderLogo>
              <Logo
                style={{
                  fill: NETWORK === RenNetwork.Mainnet ? "#001732" : "#265A99",
                }}
              />
            </HeaderLogo>
            {NETWORK === RenNetwork.Mainnet ? (
              <>RenVM Explorer</>
            ) : (
              <span style={{ color: "#265A99" }}>
                RenVM {titleCase(NETWORK)} Explorer
              </span>
            )}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <CollapseStyled id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {/* <LinkContainer to="/tools">
              <Nav.Link>Tools</Nav.Link>
            </LinkContainer> */}
            <NavDropdown title="Links" id="basic-nav-dropdown">
              <NavDropdown.Item
                href="https://renproject.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink noUnderline>renproject.io</ExternalLink>
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://bridge.renproject.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink noUnderline>Bridge</ExternalLink>
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://mainnet.renproject.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink noUnderline>Command Center</ExternalLink>
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://renprotocol.typeform.com/to/YdmFyB"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink noUnderline>Report bug or issue</ExternalLink>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="https://github.com/renproject/ren/wiki"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink noUnderline>RenVM Docs</ExternalLink>
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://renproject.github.io/ren-client-docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink noUnderline>RenJS Docs</ExternalLink>
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://renproject.github.io/ren-client-docs/contracts/deployments/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink noUnderline>Contract Addresses</ExternalLink>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form onSubmit={searchFormSubmitCallback}>
            <SearchRow>
              <SearchInputStyled
                ref={searchFormInputRef}
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <SearchButton type="submit" variant="outline-success">
                Search
              </SearchButton>
            </SearchRow>
          </Form>
        </CollapseStyled>
      </Container>
    </NavbarStyled>
  );
};
