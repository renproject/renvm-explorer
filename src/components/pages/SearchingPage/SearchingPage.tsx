import { useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { UIContainer } from "../../../containers/UIContainer";
import { SearchResultType } from "../../../lib/searchResult";
import { Monospaced } from "../../common/Monospaced";
import { Spinner } from "../../Spinner";

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
        <div>
            <Container>
                {searchResult &&
                searchResult.type === SearchResultType.Searching ? (
                    <>
                        {searchResult.multipleResults ? (
                            // Multiple results.
                            <>
                                <p>Select one of the following results:</p>
                                {searchResult.multipleResults.map((result) => {
                                    const onClick = () =>
                                        handleSelectResult(result);
                                    return (
                                        <div
                                            style={{ cursor: "pointer" }}
                                            onClick={onClick}
                                        >
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
                                        <Monospaced>
                                            {searchResult.searchString}
                                        </Monospaced>
                                        .
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
                                        <Monospaced>
                                            {searchResult.searchString}
                                        </Monospaced>
                                        . Error:{" "}
                                        {String(
                                            searchResult.errorSearching
                                                .message ||
                                                searchResult.errorSearching,
                                        )}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ) : (
                            // Searching...

                            <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
                                <div className="max-w-max mx-auto">
                                    <main className="flex flex-col sm:flex-row items-center justify-center">
                                        <Spinner />
                                        <div className="sm:ml-6">
                                            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                                                <p className="mt-1 text-base text-gray-500">
                                                    Searching for{" "}
                                                    {searchResult.searchString}
                                                </p>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </Container>
        </div>
    );
};
