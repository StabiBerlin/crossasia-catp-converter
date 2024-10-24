const _5010 = (CLSK, CLSD) => { return { code: '5010', value: `[${CLSK}]${CLSD.join('$a')}$ANACSIS` } }
const _5030 = (_, CLSD) => {
  return { code: '5030', value: `${CLSD.join('$a')}$ANACSIS` }
}
const _5060 = (CLSK, CLSD) => { return { code: '5060', value: `[${CLSK}]${CLSD.join('$a')}$ANACSIS` } }
const NDLC = (_, CLSD) => {
  return { code: '5060', value: `[NDL]${CLSD.join('$a')}$ANACSIS` }
}
const _5040 = (_, CLSD) => {
  return { code: '5040', value: `${CLSD.join('$a')}$ANACSIS` }
}
const CLSKMap = {
  DC17: _5010,
  DC18: _5010,
  DC19: _5010,
  DC20: _5010,
  DC21: _5010,
  DC22: _5010,
  LCC: _5030,
  NDC6: _5060,
  NDC7: _5060,
  NDC8: _5060,
  NDC9: _5060,
  NDC10: _5060,
  NDLC: NDLC,
  NLM: _5040
}

const parse = function (value) {
  const result = Object.entries(value.CLSK)
  .filter(([CLSK]) => CLSKMap.hasOwnProperty(CLSK)) // Filter based on the presence of CLSK in CLSKMap
  .map(([CLSK, CLSD]) => CLSKMap[CLSK](CLSK, CLSD)); // Map to the results

  return result.length > 0 ? result : null; // Return result or null

}

export { parse }