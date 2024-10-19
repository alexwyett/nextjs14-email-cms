function castString(value: any) {
  const type = typeof value;
  switch (type) {
    case 'boolean':
      return value ? '1' : ''
    case 'string':
      return value
    case 'number':
      if (isNaN(value)) {
        return 'NAN'
      }

      if (!isFinite(value)) {
        return (value < 0 ? '-' : '') + 'INF'
      }

      return value + ''
    case 'undefined':
      return ''
    case 'object':
      if (Array.isArray(value)) {
        return 'Array'
      }

      if (value !== null) {
        return 'Object'
      }

      return ''
    case 'function':
    // fall through
    default:
      throw new Error('Unsupported value type')
  }
}

export default function stripTags(input: string, allowed: string) {
  // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')

  const tags = /<\/?([a-z0-9]*)\b[^>]*>?/gi
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

  let after = castString(input)
  // removes tha '<' char at the end of the string to replicate PHP's behaviour
  after = after.substring(after.length - 1) === '<' ? after.substring(0, after.length - 1) : after

  // recursively remove tags to ensure that the returned string doesn't contain forbidden tags after previous passes (e.g. '<<bait/>switch/>')
  while (true) {
    const before = after
    after = before.replace(commentsAndPhpTags, '').replace(tags, function ($0: any, $1: any) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
    })

    // return once no more tags are removed
    if (before === after) {
      return after
    }
  }
}