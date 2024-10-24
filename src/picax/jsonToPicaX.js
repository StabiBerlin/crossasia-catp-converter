/* eslint-disable */
import {parse as OTHNParse} from './rules/OTHNRule.js'
import {parse as GMD_SMDParse} from './rules/OTHNRule.js'
import {parse as TRParse} from './rules/TRRule.js'
import {parse as VTParse, reset as VTReset} from './rules/VTRule.js'
import {parse as CWParse} from './rules/CWRule.js'
import {parse as PTBLParse, reset as PTBLReset} from './rules/PTBLRule.js'
import {parse as ALParse, reset as ALRest} from './rules/ALRule.js'
import {parse as CLSParse} from './rules/CLSRule.js'
import {parse as SHParse} from './rules/SHRule.js'
import {compare} from './util.js'
import {PicaXField} from './PicaXField.js'
// import { someLimit } from 'async'


const rewriteRules = {
  // 'ID': (value, root) => `2113 NACSIS: ${value}`,
  'ID': (value) => {return {code:2113, value:`NACSIS: ${value}`}},
  'MARCID': (value, root) => {
    const source = Object.values(root.filter(x => Object.keys(x)[0] === 'SOURCE')[0] || {'SOURCE':null})[0]
    // return `2198 Identnummer: ${source} ${value}`
    return {code:2198, value:`Identnummer: ${source} ${value}`}
  },
  'SOURCE': (value, root) => null,
  'VOLG': (value, root) => {
    const vol = Object.values(value.filter(x => Object.keys(x)[0] === 'VOL')[0] || {'VOL':null})[0]
    const price = Object.values(value.filter(x => Object.keys(x)[0] === 'PRICE')[0] || {'PRICE':null})[0]
    const isbn = Object.values(value.filter(x => Object.keys(x)[0] === 'ISBN')[0] || {'ISBN':''})[0]
    let subfield_F = [vol, vol ? price: price ? `: ${price}` : price].filter(Boolean).join(' : ')
    let XISBN = Object.values(value.filter(x => Object.keys(x)[0] === 'XISBN')[0] || {'XISBN':null})[0]
    
    // XISBN = XISBN ? `2009 ${XISBN}` : XISBN
    XISBN = XISBN ? {code:2009, value:`${XISBN}`} : XISBN
    
    // return [`2000 ${isbn}${subfield_F.length > 0 ? `$f${subfield_F}` : ''}`, XISBN].filter(Boolean).join('\n')
    return [
      {code:2000, value:`${isbn}${subfield_F.length > 0 ? `$f${subfield_F}` : ''}`}
      , XISBN,
    ].filter(Boolean)
  },
  'ISSN' : (value, root) => { 
    if (value.match(/[0-9]{8}/)) {
      value = `${value.substring(0,4)}-${value.substring(4,8)}`
    }
    // return `2010 ${value}`
    return {code:2010, value:`${value}`}
  },
  'NBN' : (value, root) => {return {code:2198, value:`Identnummer: ${value}`}},  // `2198 Identnummer: ${value}`,
  'LCCN' : (value, root) => {return {code:2198, value:`${value}`}}, //`2198 ${value}`, // conflict
  'GPON' : (value, root) => {return {code:2198, value:`${value}`}}, //`2198 ${value}`, // conflict
  'OTHN' : OTHNParse, // conflict
  'GMD' : GMD_SMDParse,
  'YEAR' : (value, root) => {
    const YEAR1 = Object.values(value.filter(x => Object.keys(x)[0] === 'YEAR1')[0] || {'YEAR1' : null})[0]
    const YEAR2 = Object.values(value.filter(x => Object.keys(x)[0] === 'YEAR2')[0] || {'YEAR2' : null})[0]
    
    const YEAR_N = Object.values(root.filter(x => Object.keys(x)[0] === 'PUB' ) || {PUB:[{'PUBDT':null}]}).map(x => Object.values(x)[0].filter(x => x.PUBDT)[0]).filter(x=>x)[0].PUBDT

    // return YEAR1 || YEAR2 || YEAR_N ? 
    //   `1100 ${YEAR1 ? YEAR1 : ''}${YEAR2 ? `$b${YEAR2}` :''}${YEAR_N ? `$n${YEAR_N}` : ''}` : null
      return YEAR1 || YEAR2 || YEAR_N ? 
      {code:1100, value:`${YEAR1 ? YEAR1 : ''}${YEAR2 ? `$b${YEAR2}` :''}${YEAR_N ? `$n${YEAR_N}` : ''}`} : null
  },
  'CNTRY': (value, root) => {
    switch (value) {
      case 'ja':
        // return `1700 XB-JP`
        value = 'XB-JP'
        break
      case 'cc':
        // return `1700 XB-CN`
        value = 'XB-CN'
        break
      case 'ko':
        // return `1700 XB-KR`
        value = 'XB-KR'
        break  
    }
    // return `1700 ${value}`
    return {code:1700, value:`${value}`}
  },
  'TXTL' : (value, root) => {
    const ORGL = Object.values(root.filter(x => Object.keys(x)[0] === 'ORGL')[0] || {'ORGL':null})[0]
    const subfield_c = ORGL ? ORGL.match(/.{1,3}/g).join('$c') : ''
    // return `1500 ${value.match(/.{1,3}/g).join('$a')}${subfield_c}`
    return {code:1500, value:`${value.match(/.{1,3}/g).join('$a')}${subfield_c}`}
    
  },
  
  'TR' : TRParse,
  'VT' : VTParse,
  
  'ED' : (value, root) => {return {code:4020, value:`${value}`}}, //`4020 ${value}`,
  
  'PUB' : (value, root) => {

    const PUBP = Object.values(value.filter(x => Object.keys(x)[0] === 'PUBP') || {'PUBP' : null}).map(x => x.PUBP).filter(Boolean)
    const PUBL = Object.values(value.filter(x => Object.keys(x)[0] === 'PUBL') || {'PUBL' : null}).map(x => x.PUBL).filter(Boolean)
    let PUBL1, PUBL_RestPUP_Rest
    if (Array.isArray(PUBL)) {
      [PUBL1, ...PUBL_RestPUP_Rest] = PUBL
      PUBL_RestPUP_Rest = PUBL_RestPUP_Rest.filter(Boolean).map(x => {return {code:4030, value:`$n${x}`}})
        // `4030 $n${x}`
    }

    // return [`4030 ${PUBP.join('$p')}$n${PUBL1}`, 
    //         PUBL_RestPUP_Rest.length > 0 ? PUBL_RestPUP_Rest.join('\n') : null].filter(Boolean).join('\n')
    return [
      {code:4030, value:`${PUBP.join('$p')}$n${PUBL1}`}, 
            PUBL_RestPUP_Rest.length > 0 ? PUBL_RestPUP_Rest : null].filter(Boolean).flat()

  },
  
  
  'PHYS' :  (value, root) => {
    return value.map(x => {
      const [subfield, subfieldValue] = Object.entries(x)[0]
      // let code = { PHYSP:'4060',
      //              PHYSI:'4061',
      //              PHYSS:'4062',
      //              PHYSA:'4063'
      // }[subfield] || null
      // return code ? `${code} ${subfieldValue}` : code

      let cleanedSsubfieldValue = subfieldValue
      let code = null
      switch (subfield) {
        case 'PHYSP':
          code = '4060'
          cleanedSsubfieldValue = subfieldValue.replace(/p$/, ' Seiten')
          break
        case 'PHYSI':
          code = '4061'
          break;
        case 'PHYSS':
          code = '4062'
          cleanedSsubfieldValue = subfieldValue.replace(/([^0-9]{0,})$/, ' $1')          
          break;
        case 'PHYSA':
          code = '4063'
          break;
        default:
          break;
      }


      return code ? {code:code, value:`${cleanedSsubfieldValue}`} : code
    }).filter(Boolean)
  },
  'NOTE' : (value, root) => {return {code:4201, value:`${value}`}}, // `4201 ${value}`,
  'CW' : CWParse,
  'PTBL' : PTBLParse,
  'AL' : ALParse,
  'CLS' : CLSParse,
  'SH' : SHParse,
}                    


const rewrite = function(obj) {
  let GMDFound = false
  let PTBLFound = false
  let VOLG = []
  const rewriteFields = Object.keys(rewriteRules)
  let result = obj.map(record => {
    let [key, value] = Object.entries(record)[0]
    if (key === 'GMD') {
      GMDFound = true
    }
    if (key === 'PTBL') {
      PTBLFound = true
    }
    if (key === 'VOLG') {
      VOLG.push(value)
    }
    if (rewriteFields.indexOf(key) !== -1) {
      record['pica3'] = rewriteRules[key](value, obj)
    }
    return record
  }).filter(Boolean).filter(x => x.pica3).map(x => x.pica3)

  VTReset() 
  PTBLReset()
  ALRest()
  if (result.length > 0) {
    if (!GMDFound) {
      result.unshift({code:'0503', value:`Band$bnc`})
      result.unshift({code:'0502', value:`ohne Hilfsmittel zu benutzen$bn`})
      result.unshift({code:'0501', value:`Text$btxt`})
      if (!PTBLFound){
        result.unshift({code:'0500', value:`A`})
      }
    }
    result.unshift({code:'5057', value:`oa1.51`})
    result.unshift({code:'5056', value:`[FID]ASIEN$qDE-1a`})
    result.unshift({code:'6100', value:`jp`})
    result.unshift({code:'1505', value:`$erda`})
    // console.dir(result)
    result = result.flat().sort(compare)
    // console.dir(result)
    if (VOLG.length === 0) {
      result.push({code:'E001', value:`k`})
      result.push({code:'7100', value:`$f6$a$du`})
      result.push({code:'8200', value:``})
    } else {
      VOLG.forEach((x, index) => {
        const vol = Object.values(x.filter(x => Object.keys(x)[0] === 'VOL')[0] || {'VOL':null})[0]
        result.push({code:`E0${index > 10 ? index + 1 : `0${index +1}` }`, value:`k`})
        if (vol) {
          result.push({code:`4801`, value:`${vol}`})
        }
        result.push({code:'7100', value:`$f6$a$du`})
        result.push({code:'8200', value:``})
      })
      
    }
  }
 return result.map(x => new PicaXField(x))
}
export {rewrite }