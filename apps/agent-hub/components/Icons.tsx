import { type ReactNode, type SVGProps } from "react";

const SvgIcon = ({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    role="img"
    aria-hidden={props["aria-label"] ? undefined : true}
    {...props}
  >
    {children}
  </svg>
);

export const IconCheck = (props: Omit<SVGProps<SVGSVGElement>, "viewBox">) => (
  <SvgIcon width="16" height="16" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
      clipRule="evenodd"
    />
  </SvgIcon>
);

export const IconCopy = (props: Omit<SVGProps<SVGSVGElement>, "viewBox">) => (
  <SvgIcon width="16" height="16" viewBox="0 0 24 24" {...props}>
    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
    <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
  </SvgIcon>
);

export const IconWallet = (props: Omit<SVGProps<SVGSVGElement>, "viewBox">) => (
  <SvgIcon width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M2.273 5.625A4.483 4.483 0 0 1 6.75 3h10.5c1.746 0 3.332.8 4.477 2.069A.75.75 0 0 1 21 6H6.75a.75.75 0 0 0 0 1.5H21v.091A4.5 4.5 0 0 1 21.75 9v.5H18a3 3 0 0 0 0 6h3.75v.5a4.5 4.5 0 0 1-4.5 4.5H6.75a4.5 4.5 0 0 1-4.5-4.5v-9a4.5 4.5 0 0 1 .023-.375Z" />
    <path d="M15.75 10.5a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 3 0V12a1.5 1.5 0 0 0-1.5-1.5Z" />
  </SvgIcon>
);

export const IconRobot = (props: Omit<SVGProps<SVGSVGElement>, "viewBox">) => (
  <SvgIcon width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Antenna */}
    <line x1="12" y1="2" x2="12" y2="5" />
    <circle cx="12" cy="2" r="0.75" fill="currentColor" stroke="none" />
    {/* Head */}
    <rect x="4" y="5" width="16" height="13" rx="2" />
    {/* Eyes */}
    <circle cx="9" cy="11" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15" cy="11" r="1.5" fill="currentColor" stroke="none" />
    {/* Mouth */}
    <path d="M9 15h6" strokeWidth="1.5" />
    {/* Ear tabs */}
    <line x1="2" y1="10" x2="4" y2="10" />
    <line x1="20" y1="10" x2="22" y2="10" />
  </SvgIcon>
);
