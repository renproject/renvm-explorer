import { HeaderLogo, NavbarStyled, SearchInputStyled } from "./HeaderStyles";
import { ReactComponent as Logo } from "../../images/logo.svg";
import {
  Navbar,
  NavDropdown,
  Nav,
  Form,
  Button,
  Container,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UIContainer } from "../../containers/UIContainer";
import { useCallback, useRef } from "react";
import { NETWORK } from "../../environmentVariables";
import { RenNetwork } from "@renproject/interfaces";

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
              <>Ren Dev Tools</>
            ) : (
              <span style={{ color: "#265A99" }}>
                Ren {NETWORK.toUpperCase()}
              </span>
            )}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
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
                renproject.io
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://bridge.renproject.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bridge
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://mainnet.renproject.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Command Center
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://renprotocol.typeform.com/to/YdmFyB"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report bug or issue
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="https://github.com/renproject/ren/wiki"
                target="_blank"
                rel="noopener noreferrer"
              >
                RenVM Docs
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://renproject.github.io/ren-client-docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                RenJS Docs
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://renproject.github.io/ren-client-docs/contracts/deployments/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contract Addresses
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline onSubmit={searchFormSubmitCallback}>
            <SearchInputStyled
              ref={searchFormInputRef}
              type="text"
              placeholder="Search"
              className="mr-sm-2"
            />
            <Button type="submit" variant="outline-success">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </NavbarStyled>
  );
};
