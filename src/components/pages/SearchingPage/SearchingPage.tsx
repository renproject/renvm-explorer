import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { UIContainer } from "../../../containers/UIContainer";
import { SearchResultType } from "../../../lib/searchResult";
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
        <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
            <div className="max-w-max mx-auto">
                <main className="flex flex-col sm:flex-row items-center justify-center">
                    {searchResult &&
                    searchResult.type === SearchResultType.Searching ? (
                        <>
                            {searchResult.multipleResults ? (
                                // Multiple results.
                                <>
                                    <p>Select one of the following results:</p>
                                    {searchResult.multipleResults.map(
                                        (result) => {
                                            const onClick = () =>
                                                handleSelectResult(result);
                                            return (
                                                <div
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={onClick}
                                                >
                                                    {result.resultPath}
                                                </div>
                                            );
                                        },
                                    )}
                                </>
                            ) : searchResult.noResult ? (
                                // No results.
                                <div className="flex items-center flex-col lg:flex-row">
                                    <span className="text-2xl font-light text-black">
                                        404
                                    </span>
                                    <div className="mt-3 lg:mt-0 lg:border-l lg:border-gray-200 lg:ml-6 lg:pl-6">
                                        <p className="mt-1 text-base text-gray-500 break-all text-center">
                                            No results for{" "}
                                            <span className="font-mono">
                                                {searchResult.searchString}
                                            </span>
                                            .
                                        </p>
                                    </div>
                                </div>
                            ) : searchResult.errorSearching ? (
                                // Error.
                                <div>
                                    <div>
                                        <div>
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
                                        </div>
                                        <div style={{ marginTop: "2em" }}>
                                            Error searching for{" "}
                                            <span className="font-mono">
                                                {searchResult.searchString}
                                            </span>
                                            . Error:{" "}
                                            {String(
                                                searchResult.errorSearching
                                                    .message ||
                                                    searchResult.errorSearching,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Searching...

                                <>
                                    <Spinner />
                                    <div className="mt-3 lg:mt-0 lg:border-l lg:border-gray-200 lg:ml-6 lg:pl-6">
                                        <p className="mt-1 text-base text-gray-500 break-all text-center">
                                            Searching for{" "}
                                            <span className="font-mono">
                                                {searchResult.searchString}
                                            </span>
                                            .
                                        </p>
                                    </div>
                                </>
                            )}
                        </>
                    ) : null}
                </main>
            </div>
        </div>
    );
};
