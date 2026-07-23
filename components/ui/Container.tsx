import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Narrower editorial reading measure (680–760px), for dense prose blocks. */
  narrow?: boolean;
}

export function Container({ children, className = "", narrow = false }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-6 md:px-10 lg:px-12 ${
        narrow ? "max-w-[760px]" : "max-w-[1240px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
