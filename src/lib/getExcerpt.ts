import stripTags from "./stripTags";

export default function getExcerpt(input: string) {
  return stripTags(input, '').replaceAll("&nbsp;", "").replaceAll('\r\n', '').replace(/[^a-zA-Z0-9\-_\s]/g, '').replaceAll('---', '').split('.')[0].slice(0, 150).trim();
}