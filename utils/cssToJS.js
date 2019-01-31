function toProperty(name) {
  if (name.charAt(0) === '-') name = name.slice(0)

  return name.replace(/[^a-z0-9]([a-z0-9])?/gi, function(v, l) {
    if (l) return l.toUpperCase()
    return ''
  })
}

function tokenizer(code) {
  const whitespc = ['\r\n', '\n\r', '\n', '\r']
  const specialChars = ['{', '}', ':', ';']
  const specialCharsPB = ['{', '}', ';']
  const tokens = []

  let token = ''
  let lastChar = '\0'
  let nextChar = '\0'
  let char = '\0'
  let sc = null
  let inBrackets = false

  for (let i = 0; i < code.length; i++) {
    if (i) lastChar = code.charAt(i - 1)
    char = code.charAt(i)
    if (i + 1 < code.length) nextChar = code.charAt(i + 1)

    if (~whitespc.indexOf(char) && ~whitespc.indexOf(lastChar)) {
      continue
    }

    sc = inBrackets ? specialChars : specialCharsPB

    if (~sc.indexOf(char)) {
      if (char === '{') inBrackets = true
      if (char === '}') inBrackets = false
      tokens.push(token)
      tokens.push(char)
      token = ''
      continue
    }

    token += char
  }

  if (token) tokens.push(token)

  const result = tokens
    .map(function(token) {
      return token.trim()
    })
    .filter(function(token) {
      return token && token !== ';'
    })

  return result
}

module.exports = function(code) {
  const tokens = tokenizer(code)
  const props = {}

  tokens.forEach((token) => {
    let [prop, value] = token.split(':')
    prop = props ? prop.trim() : ''
    value = value ? value.trim() : ''

    props[toProperty(prop)] = value
  })

  return props
}
