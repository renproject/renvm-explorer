import React, { useCallback, useRef } from "react";
import { Container, Form } from "react-bootstrap";

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
        [searchFormInputRef, handleSearchForm],
    );

    return (
        // <div>
        //     <Container>
        //         <div>
        //             <h2>Search RenVM</h2>
        //             <p>Enter a deposit transaction or a RenVM hash.</p>

        //             <Form onSubmit={searchFormSubmitCallback}>
        //                 <div>
        //                     <input
        //                         type="text"
        //                         ref={searchFormInputRef}
        //                         placeholder="Search"
        //                     />
        //                     <button type="submit">Search</button>
        //                 </div>
        //             </Form>
        //         </div>
        //     </Container>
        // </div>
        // mb-6
        <div className="relative">
            <div className="sm:max-w-3xl lg:max-w-7xl">
                <div className="relative rounded-lg px-6 py-10 bg-renblue-900 overflow-hidden shadow-xl border border-gray-200">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
                    >
                        <svg
                            className="absolute inset-0 h-full w-full"
                            preserveAspectRatio="xMidYMid slice"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 1463 360"
                        >
                            <path
                                className="text-renblue-500 text-opacity-40"
                                fill="currentColor"
                                d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                            />
                            <path
                                className="text-renblue-700 text-opacity-40"
                                fill="currentColor"
                                d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                            />
                        </svg>
                    </div>
                    <div className="relative">
                        <div className="sm:text-center">
                            <h2 className="text-3xl font-medium text-white tracking-tight sm:text-4xl">
                                Search RenVM
                            </h2>
                            <p className="mt-6 mx-auto max-w-2xl text-lg text-white text-opacity-60">
                                Enter a deposit transaction or a RenVM hash.
                            </p>
                        </div>
                        <form
                            onSubmit={searchFormSubmitCallback}
                            className="mt-12 sm:mx-auto sm:max-w-lg sm:flex"
                        >
                            <div className="min-w-0 flex-1">
                                <label htmlFor="cta-email" className="sr-only">
                                    Transaction Hash
                                </label>
                                <input
                                    id="cta-email"
                                    type="text"
                                    ref={searchFormInputRef}
                                    className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-renblue-600"
                                    placeholder="Transaction hash"
                                />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-3">
                                <button
                                    type="submit"
                                    className="block w-full rounded-md border border-transparent px-5 py-3 bg-renblue-500 text-base font-medium text-white shadow hover:bg-renblue-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-renblue-600 sm:px-10"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
