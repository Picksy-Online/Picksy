import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 115 24"
      fill="none"
      aria-label="Picksy Logo"
      {...props}
    >
      <path
        d="M10 0L11.5355 8.46447L20 10L11.5355 11.5355L10 20L8.46447 11.5355L0 10L8.46447 8.46447L10 0Z"
        fill="hsl(var(--primary))"
        transform="translate(0, 2)"
      />
      <text
        x="25"
        y="18"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        Picksy
      </text>
    </svg>
  );
}
