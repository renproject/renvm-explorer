import styled from "styled-components";

const TaggedTextOuter = styled.div`
  border: 1px solid #001732;
  border-radius: 5px;
  display: inline;
  height: 100%;
  padding: 2px 0;

  > span {
    padding: 2px 5px;
  }
`;

const TaggedTextTag = styled.span`
  color: white;
  background: #001732;
`;

export const TaggedText: React.FC<{ tag: string }> = ({ tag, children }) => {
  return (
    <TaggedTextOuter>
      <TaggedTextTag>{tag}</TaggedTextTag>
      <span style={{ marginRight: 5 }}> {children}</span>
    </TaggedTextOuter>
  );
};
