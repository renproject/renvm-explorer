import { ExternalLink } from "./ExternalLink";

interface Props {
  href: string | undefined;
  noUnderline?: boolean;
}

export const MaybeLink: React.FC<Props> = ({ href, noUnderline, children }) =>
  href ? (
    <ExternalLink
      style={{ textDecoration: noUnderline ? "none" : "underline" }}
      href={href}
    >
      {children}
    </ExternalLink>
  ) : (
    <>{children}</>
  );
