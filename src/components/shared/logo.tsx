import { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1600 900" 
      fill="currentColor"
      {...props}
    >
      <path d="M0 0h1600l-158 230h-232v670H980V230H228v118h572L600 572H228v328H0Z" />
    </svg>
  );
}
