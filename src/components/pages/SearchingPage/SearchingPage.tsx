import { useEffect } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { UIContainer } from "../../../containers/UIContainer";
import { SearchResultType } from "../../../lib/searchResult";
import { Monospaced } from "../../common/Monospaced";
import { SearchingPageOuter } from "./SearchingPageStyles";

export const SearchingPage = () => {
  const { searchResult, handleSearchURL, handleSelectResult } =
    UIContainer.useContainer();

  const { search } = useParams<{ search: string }>();

  useEffect(() => {
    if (!search) {
      return;
    }
    handleSearchURL(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <SearchingPageOuter>
      <Container>
        {searchResult && searchResult.type === SearchResultType.Searching ? (
          <>
            {searchResult.multipleResults ? (
              // Multiple results.
              <>
                <p>Select one of the following results:</p>
                {searchResult.multipleResults.map((result) => {
                  const onClick = () => handleSelectResult(result);
                  return (
                    <div style={{ cursor: "pointer" }} onClick={onClick}>
                      {result.resultPath}
                    </div>
                  );
                })}
              </>
            ) : searchResult.noResult ? (
              // No results.
              <Card border="0">
                <Card.Body>
                  <Card.Title>
                    {" "}
                    <p
                      style={{
                        fontSize: 70,
                        fontWeight: 300,
                        color: "#001732",
                      }}
                    >
                      404
                    </p>
                  </Card.Title>
                  <Card.Text style={{ marginTop: "2em" }}>
                    No results for{" "}
                    <Monospaced>{searchResult.searchString}</Monospaced>.
                  </Card.Text>
                </Card.Body>
              </Card>
            ) : searchResult.errorSearching ? (
              // Error.
              <Card border="0">
                <Card.Body>
                  <Card.Title>
                    {" "}
                    <p
                      style={{
                        fontSize: 70,
                        fontWeight: 300,
                        color: "#001732",
                      }}
                    >
                      Error
                    </p>
                  </Card.Title>
                  <Card.Text style={{ marginTop: "2em" }}>
                    Error searching for{" "}
                    <Monospaced>{searchResult.searchString}</Monospaced>. Error:{" "}
                    {String(
                      searchResult.errorSearching.message ||
                        searchResult.errorSearching
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            ) : (
              // Searching...
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
                    Searching for{" "}
                    <Monospaced>{searchResult.searchString}</Monospaced>...
                  </Card.Text>
                </Card.Body>
              </Card>
            )}
          </>
        ) : null}
      </Container>
    </SearchingPageOuter>
  );
};
