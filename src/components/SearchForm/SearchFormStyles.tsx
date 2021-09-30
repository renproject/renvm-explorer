import { Button, FormControl, Row } from "react-bootstrap";
import styled from "styled-components";

export const SearchFormOuter = styled.div`
  margin-top: 50px;
`;
export const SearchFormInner = styled.div`
  text-align: left;
`;

export const SearchTitle = styled.h2`
  font-size: 20px;
`;

export const SearchSubtitle = styled.p`
  font-size: 14px;
`;

export const SearchRow = styled(Row)`
  max-width: 800px;
`;

export const SearchButton = styled(Button)`
  flex: 1 0;
  margin: 0 5px;
`;

export const SearchFormControl = styled(FormControl)`
  flex: 2 0;
`;
