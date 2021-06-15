import {
  SearchFormInner,
  SearchFormOuter,
  SearchSubtitle,
  SearchTitle,
} from "./SearchFormStyles";
import { Container, Form, Col, Button, FormControl } from "react-bootstrap";
import React, { useCallback, useRef } from "react";
import { UIContainer } from "../../containers/UIContainer";

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
            Enter a deposit transaction, a gateway address or a RenVM hash.
          </SearchSubtitle>

          <Form onSubmit={searchFormSubmitCallback}>
            <Form.Row>
              <Col xs={5}>
                <FormControl
                  ref={searchFormInputRef}
                  type="text"
                  placeholder="Search"
                />
              </Col>
              <Col>
                <Button type="submit">Search</Button>
              </Col>
            </Form.Row>
          </Form>
        </SearchFormInner>
      </Container>
    </SearchFormOuter>
  );
};
