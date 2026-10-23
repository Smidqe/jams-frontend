//shared tailwind classes for the plain <button>s, same look as the old shadcn icon buttons
const iconButtonBase =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-md outline-none transition-all " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

export const iconButton = `${iconButtonBase} border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50`;

export const iconButtonPrimary = `${iconButtonBase} bg-primary text-primary-foreground hover:bg-primary/90`;
