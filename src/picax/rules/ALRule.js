import {kanaToLatn} from '../../utils/KanaToLatn.js'

let count = 0
const parse = function(value) {
  count++
  const {AHDNG, AHDNGR, AF} = value.reduce((acc,x)=> {
    // acc.PTBID = acc.PTBID || x.PTBID
    x.AHDNG = x.AHDNG ? x.AHDNG.replace(/\s{0,}\(/,'$h').replace(')','') : x.AHDNG
    acc.AHDNG = acc.AHDNG || x.AHDNG
    acc.AHDNGR = acc.AHDNGR || x.AHDNGR
    acc.AF = acc.AF || x.AF
    return acc
  },{AHDNG: null, AHDNGR: null, AF:null})

  const result = count === 1 ? [
    AHDNGR ? {code:3000, subCode:'$T01', lang:'$ULatn%%', value:`${kanaToLatn(AHDNGR).split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')}${AF ? `$p${AF}` : ''}` } : {code:3000, subCode:'$T01', lang:'$ULatn%%', value:`${kanaToLatn('')}${AF ? `$p${AF}` : ''}` },
    AHDNG ? {code:3000, subCode:'$T01', lang:'$UJpan%%', value:`${AHDNG.trim()}${AF ? `$p${AF}` : ''}` }: null,
  ].filter(Boolean) :  
  [
    AHDNGR ? {code:3010, subCode:`$T${ count >= 11 ? count -1 : `0${count -1}`}`, lang:'$ULatn%%', value:`${kanaToLatn(AHDNGR).split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')}${AF ? `$p${AF}` : ''}` } : {code:3000, subCode:'$T01', lang:'$ULatn%%', value:`${kanaToLatn('')}${AF ? `$p${AF}` : ''}` },
    AHDNG ? {code:3010, subCode:`$T${ count >= 11 ? count -1 : `0${count -1}`}`, lang:'$UJpan%%', value:`${AHDNG.trim()}${AF ? `$p${AF}` : ''}` }: null,
  ].filter(Boolean)

  return result.length > 0 ? result : null
}

const reset = function() {
  count = 0
}
export {parse, reset}