import type { CSSProperties } from "react";

const arrows = {
  up: "up-arrow.svg",
  down: "down-arrow.svg",
  right: "right-arrow.svg",
  next: "right-arrow.svg",
  previous: "left-arrow.svg",
  back: "left-arrow.svg",
  return: "left-arrow.svg",
} as const;

export function ArrowIcon({ direction = "right", className = "" }: { direction?: keyof typeof arrows; className?: string }) {
  return <span className={`arrow-icon ${className}`} style={{ "--arrow-url": `url(/icons/set-5/simple/${arrows[direction]})` } as CSSProperties} aria-hidden="true" />;
}
