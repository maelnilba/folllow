import React, { forwardRef } from "react";
// import classNames from 'classnames';

import styles from "./List.module.css";

export interface Props {
  children: React.ReactNode;
  columns?: number;
  style?: React.CSSProperties;
  horizontal?: boolean;
}

export const List = forwardRef<HTMLUListElement, Props>(
  ({ children, columns = 1, horizontal, style }: Props, ref) => {
    return (
      <ul
        ref={ref}
        style={
          {
            ...style,
            "--columns": columns,
          } as React.CSSProperties
        }
        className={`after:col-start-[${columns}] ${
          horizontal && "w-full grid-flow-col"
        } m-2.5 box-border grid min-w-[350px] auto-rows-auto grid-rows-[repeat(var(--columns,1),1fr)] gap-2.5 rounded-md p-5 pb-0 transition-colors after:h-4 after:content-none `}
      >
        {children}
      </ul>
    );
  }
);
