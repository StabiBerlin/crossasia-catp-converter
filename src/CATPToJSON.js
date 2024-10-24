const deleteRules = [
  '_DBNAME_','CRTDT','CRTFA','RNWDT','RNWFA',
  'MARCST','MARCFLG',
  'NDLCN',
  'REPRO','TTLL',
  'PUB.PUBF',
  'ISBNKEY','ISSNKEY','YEARKEY','AKEY','LANGKEY','TITLEKEY','AUTHKEY','PUBLKEY','PUBPKEY','SHKEY','DDCKEY','NDCKEY','OTHKEY','FTITLEKEY',
  // 'SH.SHT'
]

// Function to clean up data by removing unnecessary fields and values
const cleanUp = function(obj) {
  
  const CW = obj
    .filter(x => x.CW)
    .reduce((acc, x) => {
      const subCW = x.CW.reduce((subAcc, subX) => {
        Object.assign(subAcc, subX)  // Efficiently merge key-value pairs
        return subAcc
      }, {})

      if (
        (subCW.CWT && /^[^ ]{1,}:/.test(subCW.CWT)) ||
        (subCW.CWR && /^[^ ]{1,}:/.test(subCW.CWR))
      ) {
        acc.CW.push([])
      }

      // Add a comment to explain the purpose of this line
      acc.CW[acc.CW.length - 1].push(subCW)
      return acc
    }, { CW: [[]] })

  CW.CW = CW.CW.filter(x => x.length > 0) // Only retain non-empty arrays

  const CLS = obj
    .filter(x => x.CLS)
    .reduce((acc, x) => {
      acc.CLS.CLSK = acc.CLS.CLSK || {}
      const { CLSK, CLSD } = x.CLS.reduce((clsAcc, clsX) => {
        return {
          CLSK: clsAcc.CLSK || clsX.CLSK,
          CLSD: clsAcc.CLSD || clsX.CLSD,
        }
      }, { CLSK: null, CLSD: null })

      if (CLSK) {
        acc.CLS.CLSK[CLSK] = acc.CLS.CLSK[CLSK] || []
        acc.CLS.CLSK[CLSK].push(CLSD)
      }
      return acc;
    }, { CLS: {} })

  const result = obj
    .filter(x => !x.CW && !x.CLS)
    .map(record => {
      let [key, value] = Object.entries(record)[0]

      // Remove records based on deleteRules
      if (deleteRules.includes(key)) return null

      // If value is an array, filter its contents
      if (Array.isArray(value)) {
        value = value.filter(x => !deleteRules.includes(`${key}.${Object.keys(x)[0]}`))

        return value.length > 0 ? { [key]: value } : null
      }

      return record
    })
    .filter(Boolean)  // Remove null values

  // Add CW and CLS back to the result if they're not empty
  if (CW.CW[0]?.length > 0) result.push(CW)
  if (Object.keys(CLS.CLS).length > 0) result.push(CLS)

  return result
}

// Function to parse lines of text into a structured object format
const parse = function(lines) {  
  const record = []
  const iternator = lines[Symbol.iterator]()
  let result = iternator.next()
  let header = ''
  let tmpObject = {}
  while (!result.done) {
    const line = result.value.trim()
    if (line.startsWith('</')) {
      record.push(tmpObject)
      tmpObject = null
      header = ''
    } else if (line.startsWith('<')) {
      tmpObject = {}
      header = line.replace(/[<>]/gm, '')
      tmpObject[header] = []
    } else {
      let obj = {}
      obj[`${line.split('=')[0]}`] = `${line.split('=').slice(1).join('=')}`
      const base = tmpObject ? tmpObject[header] || record : record
      base.push(obj)
    }
    
    result = iternator.next()
  }

  // console.dir(JSON.stringify(cleanUp(record)))
  return cleanUp(record)
}

export {parse}