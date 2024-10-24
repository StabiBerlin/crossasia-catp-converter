import { kanaToLatn } from '../../utils/KanaToLatn.js';

let Order_3260 = 0;

const formatOrderCode = () => `$T${Order_3260 > 9 ? Order_3260 : `0${Order_3260}`}`;

const parse = function(value) {
  const { VTK, VTD, VTR, VTVR } = value.reduce((acc, x) => ({
    VTK: acc.VTK || x.VTK,
    VTD: acc.VTD || x.VTD,
    VTR: acc.VTR || x.VTR,
    VTVR: acc.VTVR || x.VTVR
  }), { VTK: null, VTD: null, VTR: null, VTVR: null });

  const [VTD1 = '', ...VTDRest] = VTD ? VTD.split(' = ') : [];
  const [VTR1 = '', ...VTRRest] = VTR ? VTR.split(' = ') : [];
  const max = Math.max(VTDRest.length, VTRRest.length);
  
  const VT1 = VTK_MAP[VTK] ? VTK_MAP[VTK](VTD1, VTR1) : null;
  const rest = [];

  for (let i = 0; i < max; i++) {
    Order_3260++;
    const orderCode = formatOrderCode();
    rest.push(
      { code: 3260, subCode: orderCode, lang: '$ULatn%%', value: kanaToLatn(VTRRest[i] || '') },
      { code: 3260, subCode: orderCode, lang: '$UJpan%%', value: VTDRest[i] || '' },
      { code: 3260, subCode: orderCode, lang: '$UKana%%', value: VTRRest[i] || '' }
    );
  }

  return [VT1, rest.length ? rest : null, VTVR ? field_3260(VTVR) : null].flat().filter(Boolean);
};

const field_3260 = (VTVR) => {
  Order_3260++;
  const orderCode = formatOrderCode();
  return [
    { code: 3260, subCode: orderCode, lang: '$ULatn%%', value: kanaToLatn(VTVR || '') },
    { code: 3260, subCode: orderCode, lang: '$UKana%%', value: VTVR }
  ];
};

const Abweichender_4212 = (VTD = '', VTR = '') => [
  { code: 4212, subCode: '$T01', lang: '$ULatn%%', value: `Abweichender Titel: ${kanaToLatn(VTR || '')}` },
  { code: 4212, subCode: '$T01', lang: '$UJpan%%', value: `Abweichender Titel: ${VTD}` }
];

const bare_3210_3260 = (VTD = '', VTR = '') => [
  { code: 3210, subCode: '$T01', lang: '$ULatn%%', value: kanaToLatn(VTR || '') },
  { code: 3210, subCode: '$T01', lang: '$UJpan%%', value: VTD }
];

const bare_3260 = (VTD = '', VTR = '') => {
  Order_3260++;
  const orderCode = formatOrderCode();
  return [
    { code: 3260, subCode: orderCode, lang: '$ULatn%%', value: kanaToLatn(VTR || '') },
    { code: 3260, subCode: orderCode, lang: '$UJpan%%', value: VTD },
    { code: 3260, subCode: orderCode, lang: '$UKana%%', value: VTR }
  ];
};

const Haupttitel_4213 = (VTD = '', VTR = '') => [
  { code: 4212, subCode: '$T01', lang: '$ULatn%%', value: `Abweichender Titel: ${kanaToLatn(VTR || '')}` },
  { code: 4213, subCode: '$T01', lang: '$UJpan%%', value: `Haupttitel früher: ${VTD}` },
  { code: 4213, subCode: '$T01', lang: '$UKana%%', value: `Haupttitel früher: ${VTR}` }
];

const VTK_MAP = {
  'AB': Abweichender_4212,
  'KT': Abweichender_4212,
  'AT': Abweichender_4212,
  'BC': Abweichender_4212,
  'CL': Abweichender_4212,
  'CP': Abweichender_4212,
  'CV': Abweichender_4212,
  'DT': Abweichender_4212,
  'MT': Haupttitel_4213,
  'OH': Abweichender_4212,
  'OR': bare_3210_3260,
  'PT': Abweichender_4212,
  'RT': Abweichender_4212,
  'ST': Abweichender_4212,
  'TT': Abweichender_4212,
  'RM': Abweichender_4212,
  'TL': Abweichender_4212,
  'UT': bare_3210_3260,
  'VT': bare_3260
};

const reset = () => {
  Order_3260 = 0;
};

export { parse, reset };
