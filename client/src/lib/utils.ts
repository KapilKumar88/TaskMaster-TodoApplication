import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(fullName: string) {
  if (fullName === undefined) {
    return "";
  }
  const names = fullName.split(" ");
  const initials = names
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase());
  return initials.join("");
}
