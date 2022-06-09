import { PopulatedTransaction } from "ethers";

interface Props {
    chain: string;
    details: PopulatedTransaction;
}

export const EVMTxDetails = ({ chain, details }: Props) => {
    return (
        <>
            {details.to ? (
                <div className="sm:grid sm:grid-cols-6 sm:gap-6 py-2">
                    <dt className="text-sm font-medium text-gray-500">To</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-5">
                        {details.to}
                    </dd>
                </div>
            ) : null}
            {details.data ? (
                <div className="sm:grid sm:grid-cols-6 sm:gap-6 py-2">
                    <dt className="text-sm font-medium text-gray-500">Data</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-5 truncate">
                        {details.data}
                    </dd>
                </div>
            ) : null}
        </>
    );
};
