import { HomepageOuter } from "./HomepageStyles";
import { SearchForm } from "../../SearchForm/SearchForm";
import { LatestTransactions } from "../../LatestTransactions/LatestTransactions";

export const Homepage = () => {
  return (
    <HomepageOuter>
      <SearchForm />
      <LatestTransactions />
    </HomepageOuter>
  );
};
