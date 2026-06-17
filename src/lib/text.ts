export function stripQuotes(text: string): string {
  return text.replace(/^[\s"'“”‘’]+|[\s"'“”‘’]+$/g, "").trim();
}
