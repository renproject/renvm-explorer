import React, { useCallback, useRef } from "react";
import { Container, Form } from "react-bootstrap";

import { UIContainer } from "../../containers/UIContainer";
import {
    SearchButton,
    SearchFormControl,
    SearchFormInner,
    SearchFormOuter,
    SearchRow,
    SearchSubtitle,
    SearchTitle,
} from "./SearchFormStyles";

export const SearchForm = () => {
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
    <SearchFormOuter>
      <Container>
        <SearchFormInner>
          <SearchTitle>Search RenVM</SearchTitle>
          <SearchSubtitle>
            Enter a deposit transaction or a RenVM hash.
          </SearchSubtitle>

          <Form onSubmit={searchFormSubmitCallback}>
            <SearchRow>
              <SearchFormControl
                ref={searchFormInputRef}
                type="text"
                placeholder="Search"
              />
              <SearchButton type="submit">Search</SearchButton>
            </SearchRow>
          </Form>
        </SearchFormInner>
      </Container>
    </SearchFormOuter>
  );
};
