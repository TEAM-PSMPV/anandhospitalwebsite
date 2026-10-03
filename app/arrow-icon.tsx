const arrows = {
  right: "right-arrow.svg",
  next: "right-arrow-next.svg",
  previous: "arrow-left.svg",
  back: "left-arrow-back.svg",
  return: "left-arrow-return.svg",
} as const;

export function ArrowIcon({ direction = "right", className = "" }: { direction?: keyof typeof arrows; className?: string }) {
  return <img className={`arrow-icon ${className}`} src={`/icons/set-5/${arrows[direction]}`} width={24} height={24} alt="" aria-hidden="true" />;
}
