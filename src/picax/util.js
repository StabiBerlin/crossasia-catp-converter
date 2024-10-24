const toInt = function(obj) {
  const code = obj.code || '0000'
  const subCode = obj.subCode ? obj.subCode : '$T99'
  const lang = obj.lang ? obj.lang === '$UJpan%%' ? '2' : obj.lang === '$UKana%%' ? '3' : obj.lang === '$ULatn%%' ? '1' : '9' : '9'
  return `${code}${subCode}${lang}`
}

const compare = function(a, b) {
  const keyA = toInt(a)
  const keyB = toInt(b)
  return keyA > keyB ? 1 : keyA < keyB ? -1 : 0
}

export {compare}