import { useRouteMatch } from "react-router-dom";
import { SearchingPageOuter } from "./SearchingPageStyles";
import { Container, Card, Spinner } from "react-bootstrap";
import { Monospaced } from "../../common/Monospaced";
import { useEffect } from "react";
import { UIContainer } from "../../../containers/UIContainer";

export const SearchingPage = () => {
  const { searchString, searchResult, handleSearchURL, handleSelectResult } =
    UIContainer.useContainer();

  const {
    params: { search },
  } = useRouteMatch<{ search: string }>();

  useEffect(() => {
    handleSearchURL(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <SearchingPageOuter>
      <Container>
        {searchResult && Array.isArray(searchResult) ? (
          <>
            <p>Select one of the following results:</p>
            {searchResult.map((result) => {
              const onClick = () => handleSelectResult(result);
              return (
                <div style={{ cursor: "pointer" }} onClick={onClick}>
                  {result.resultPath}
                </div>
              );
            })}
          </>
        ) : (
          <Card border="0">
            <Card.Body>
              <Card.Title>
                <Spinner
                  animation="border"
                  role="status"
                  variant="success"
                  style={{ borderWidth: 1 }}
                ></Spinner>
              </Card.Title>
              <Card.Text style={{ marginTop: "2em" }}>
                Searching for <Monospaced>{searchString}</Monospaced>...
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </Container>
    </SearchingPageOuter>
  );
};
