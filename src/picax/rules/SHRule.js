const parse = function(value) {

  const SHKMap = (shk) => {
    switch(shk) {
      case 'A' :
        return 'p'
      case 'B' :
      case 'C' :
        return 'k'
      case 'D' :
      case 'H' :
      case 'K' :
      case 'L' :
      case 'M' :
        return 's'
      case 'E' :
      case 'F' :
      case 'G' :
        return 'g'
      case 'J' :
        return 'f'
      default:
        return null
    }
  }



  const {SHD, SHT, SHK} = value.reduce((acc,x)=> {
    acc.SHD = x.SHD ? x.SHD.split(" -- ").join("$a") : acc.SHD
    acc.SHT = x.SHT ? x.SHT : acc.SHT
    acc.SHK = x.SHK ? SHKMap(x.SHK) : acc.SHK
    return acc
  },{SHD: null, SHT: null, SHK: null})
  
  return SHD? {code:5520, value:`[${SHT}]|${SHK}|${SHD}$ANACSIS`} : null
}

export {parse}