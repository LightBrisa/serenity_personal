import type { AnchorHTMLAttributes } from 'react';

type SafeLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};

/**
 * Vinext's production client router currently prevents internal Link clicks in
 * this build. Native anchors keep navigation reliable in both Sites and local
 * production previews; the full-page transition is acceptable for this MVP.
 */
export function SafeLink({ href, ...props }: SafeLinkProps) {
  return <a href={href} {...props} />;
}
