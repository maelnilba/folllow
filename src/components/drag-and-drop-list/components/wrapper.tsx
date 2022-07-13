import React from "react";

interface Props {
  children: React.ReactNode;
  center?: boolean;
  style?: React.CSSProperties;
}

export function Wrapper({ children, center, style }: Props) {
  return (
    <div
      className={`box-border flex w-full p-5 ${
        center ? "justify-center" : "justify-start"
      }`}
    >
      {children}
    </div>
  );
}
