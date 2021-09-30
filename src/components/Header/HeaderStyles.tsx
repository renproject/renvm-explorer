import { Button, FormControl, Navbar, Row } from "react-bootstrap";
import styled from "styled-components";

export const HeaderLogo = styled.div`
  display: inline;
  > svg {
    height: 30px;
  }
  margin-right: 10px;
`;

export const NavbarStyled = styled(Navbar)`
  padding-top: 1rem;
  padding-bottom: 1rem;
  /* input:focus {
    border-color: red !important;
  } */
`;

export const SearchInputStyled = styled(FormControl)`
  flex: 1 0;

  @media screen and (max-width: 991px) {
    margin: 0 5px;
    width: calc(100% - 10px);
  }
`;

export const CollapseStyled = styled(Navbar.Collapse)`
  justify-content: space-between;
`;

export const SearchRow = styled(Row)`
  @media screen and (max-width: 991px) {
    flex-flow: column;
  }
`;

export const SearchButton = styled(Button)`
  flex: 1 0;
  margin: 0 5px;
  width: calc(100% - 10px);

  @media screen and (max-width: 991px) {
    margin-top: 5px;
  }
`;
