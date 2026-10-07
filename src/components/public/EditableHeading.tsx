import { createElement, type HTMLAttributes, type ReactNode } from "react";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface EditableHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: string;
  fallbackLevel?: HeadingLevel;
  children: ReactNode;
}

export function getHeadingLevel(
  copy: object | undefined,
  field: string,
  fallbackLevel: HeadingLevel,
): HeadingLevel {
  const value = copy ? Reflect.get(copy, `${field}HeadingLevel`) : undefined;
  return typeof value === "string" && /^h[1-6]$/.test(value)
    ? (value as HeadingLevel)
    : fallbackLevel;
}

export function isCopyFieldEnabled(copy: object | undefined, field: string): boolean {
  const value = copy ? Reflect.get(copy, `${field}Enabled`) : undefined;
  return value !== false && value !== "false";
}

export default function EditableHeading({
  level,
  fallbackLevel = "h2",
  children,
  ...props
}: EditableHeadingProps) {
  const headingLevel = level && /^h[1-6]$/.test(level)
    ? (level as HeadingLevel)
    : fallbackLevel;

  return createElement(headingLevel, props, children);
}
