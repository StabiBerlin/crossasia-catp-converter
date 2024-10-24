import { kanaToLatn } from '../../utils/KanaToLatn.js'
import { compare } from '../util.js'
const parse = function (value) {

  const result = value.map((x, i) => {
    i += 1
    const index = i < 10 ? `0${i}` : `${i}`
    const JPan = `4207 $T${index}$UJpan%%`
    const Kana = `4207 $T${index}$UKana%%`
    const Latn = `4207 $T${index}$ULatn%%`

    const sumObj = {}
    sumObj[JPan] = []
    sumObj[Kana] = []
    sumObj[Latn] = []

    const result = x.map(x => {
      const CWT = x.CWT || null
      const CWR = x.CWR || null
      const CWA = x.CWA || null

      const obj = {}
      const CWTmatch = CWT.match(/^[^ ]{1,}: {1,}/);
      const header = CWTmatch ? CWTmatch[0] : '';
      obj[JPan] = CWT ? CWA ? `${CWT} / ${CWA}` : `${CWT}` : ''
      obj[Latn] = CWR ? CWA ? `${header}${kanaToLatn(CWR)} / ${kanaToLatn(CWA)}` : `${header}${kanaToLatn(CWR)}` : ''
      return obj

    }).reduce((acc, x) => {
      acc[JPan].push(x[JPan])
      acc[Latn].push(x[Latn])
      return acc
    }, sumObj)

    return Object.entries(result).map(x => {
      const [key, values] = x
      const value = values.filter(x => x.trim().length > 0).join(' -- ')
      if (key === JPan) {
        return value.trim().length > 0 ? { code: `4207`, subCode: `$T${index}`, lang: `$UJpan%%`, value: `${value}` } : null
      }
      return value.trim().length > 0 ? { code: `4207`, subCode: `$T${index}`, lang: `$ULatn%%`, value: `${value}` } : null

    }).filter(Boolean)

  })
  return result.flat().sort(compare)
}

export { parse }