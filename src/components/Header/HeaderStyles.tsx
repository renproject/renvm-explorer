import styled from "styled-components";

import { Navbar, FormControl } from "react-bootstrap";

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

export const SearchInputStyled = styled(FormControl)``;
