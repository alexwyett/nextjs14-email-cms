export function slugify(string: string) {
  return string.replace( /[\u0300-\u036f]/g, '' )
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\.\/]+/g, '')
    .replace(/\-\-+/g, '-');
}