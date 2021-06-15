import { Container } from "react-bootstrap";
import styled from "styled-components";

export const TransactionPageOuter = styled.div``;
export const TransactionPageContainer = styled(Container)`
  text-align: left;

  .card {
    overflow: auto;
    @media screen and (max-width: 767px) {
      overflow: unset;
    }
  }

  table {
    @media screen and (max-width: 767px) {
      table-layout: fixed;
    }
  }

  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const TransactionPageTitle = styled.h2`
  font-size: 20px;
  margin: 0;
  margin-bottom: 20px;

  // Use flex and two span children so that selecting the hash won't also select
  // the text "Transaction".
  display: flex;

  span {
    margin-right: 5px !important;

    &:last-child {
      margin-right: 0 !important;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const TransactionSpinner = styled.div`
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > div {
    border-width: 1px;
  }
`;
