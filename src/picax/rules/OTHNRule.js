const parse = (value) => {
    const [subfield, subfieldValue] = value.split(':')
    const deleteRules = ['GPO','GPON','ISRC','JLA','KAKEN']
    if (deleteRules.includes(subfieldValue)) {
          return null
    }
    switch (subfield) {
      case 'CODEN' :
        return {code:2200, value:`${subfieldValue}`}
      case 'ISMN':
          return {code:2020, value:`${subfieldValue}`}
      case 'ISSN':
        const  tmp = subfieldValue.match(/[0-9]{8}/) ? `${subfieldValue.substring(0,4)}-${subfieldValue.substring(4,8)}` : subfieldValue
        return {code:2010, value:`${tmp}`}

      case 'LANO':
          return {code:2230, value:`Weitere Nummer: ${subfieldValue}`}

      case 'LCCN':
          return {code:2040, value:`${subfieldValue}`}

      case 'NBN':
          return {code:2198, value:`Identnummer: ${subfieldValue}`}

      case 'MUNO':
          return {code:2198, value:`Identnummer: ${subfieldValue}`}

      case 'NCID':
          return {code:2113, value:`NACSIS: ${subfieldValue}`}

      case 'NDLCN':
          return {code:2198, value:`Identnummer: ${subfieldValue}`}
   
      case 'NDLPN':
          return {code:2198, value:`Identnummer: ${subfieldValue}`}
 
      case 'PLNO':
          return {code:2230, value:`Plattennummer: ${subfieldValue}`}
 
      case 'PUNO':
          return {code:2230, value:`Weitere Nummer: ${subfieldValue}`}
 
      case 'TRC':
          return {code:2198, value:`Identnummer: ${subfieldValue}`}
 
      case 'TXN':
          return {code:2198, value:`Identnummer: ${subfieldValue}`}
 
      case 'ULPN':
          return {code:2198, value:`Identnummer: ${subfieldValue}`}
 
      case 'UPC':
          return {code:2202, value:`${subfieldValue}`}

      case 'VWN':
          return {code:2230, value:`Weitere Nummer: ${subfieldValue}`}

      default:
        return null
    }
}

export {parse}