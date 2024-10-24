import { kanaToLatn } from '../../utils/KanaToLatn.js';  // Import utility to convert Kana to Latin characters
import { compare } from '../util.js';  // Import comparison function for sorting

let order = 0;  // Initialize a global order variable for tracking record codes

// Main function to parse the input data
const parse = function(value) {

  // Reduce input array to extract PTBK, PTBTR, PTBTRR, and PTBNO fields (only the first occurrence of each)
  let { PTBK, PTBTR, PTBTRR, PTBNO } = value.reduce((acc, x) => {
    acc.PTBK = acc.PTBK || x.PTBK;
    acc.PTBTR = acc.PTBTR || x.PTBTR;
    acc.PTBTRR = acc.PTBTRR || x.PTBTRR;
    acc.PTBNO = acc.PTBNO || x.PTBNO;
    return acc;
  }, { PTBK: null, PTBTR: null, PTBTRR: '', PTBNO: null });  // Default values

  let _0500_value = null;  // Initialize the 0500 value

  // Switch case to assign a specific value to _0500 based on the PTBK value
  switch (PTBK) {
    case 'a':
    case 'aa':
      _0500_value = 'Aa-ÜBERPRÜFEN';
      break;
    case 'b':
    case 'bb':
      _0500_value = 'AF-ÜBERPRÜFEN';
      break;
    case 'ab':
    case 'ba':
      _0500_value = 'AÜBERPRÜFEN';
      break;
  }
  
  const _0500 = { code: '0500', value: _0500_value };  // Create 0500 record with the determined value

  // Split the PTBTR field to extract the title (TITLE_JAP) and author (AUTHOR_JAP)
  const temp = PTBTR.split(' / ');
  const TITLE_JAP = temp[0] || null;
  const AUTHOR_JAP = temp[1] || null;

  // Split PTBNO into individual extra details
  const extra = (PTBNO || '').split(' . ').map(x => x.split(' ; ').map(x => x.replace(/^\. /, '')));
  const _4018 = [];  // Array to store 4018 records
  const extraStuffJAP = [];  // Store extra details for Japanese output
  const extraStuffKAN = [];  // Store extra details for Kana output

  const $tail = '';  // Initialize tail (additional suffix) variable

  // Loop through extra details and generate 4018 records for each
  extra.forEach(x => {
    const [head, ...tail] = x;  // Split head and tail of the extra details
    let headJap, headKan = '';  // Initialize variables for head (Japanese and Kana)
    
    // Check if head contains certain separators (|| or /) and process accordingly
    if (head.indexOf('||') != -1 || head.indexOf(' / ') !== -1) {
      let pJap, pKan, pAuthor = '';  // Initialize placeholders for Japanese and Kana versions of head
      
      // Split head into Japanese and Kana if '||' is present
      if (head.indexOf('||') != -1) {
        [pJap, pKan] = head.split('||');
      } else {
        pJap = head;
      }

      // Further split Japanese part to extract author if ' / ' is present
      if (pJap.indexOf(' / ') !== -1) {
        [pJap, pAuthor] = pJap.split(' / ');
      }

      // Generate the formatted Japanese head (with optional author)
      if (pJap.length > 0) {
        headJap = `$p${pJap.trim()}${pAuthor.length > 0 ? `$h${pAuthor.trim()}` : ''}`;
      }

      // Generate the formatted Kana head (with optional author)
      if (pKan.length > 0) {
        headKan = `$p${pKan.trim()}${pAuthor.length > 0 ? `$h${pAuthor.trim()}` : ''}`;
      }

      // Create formatted tail and push 4018 records
      const temp = tail.map(x => `$m${x}`).join('');
      tail.forEach(x => {
        _4018.push({ code: `418${order}`, subCode: '$T01', lang: '$UJpan%%', value: `#J000,b,s#!PPN!${x.length > 0 ? `$l${x}` : ''}` });
        _4018.push({ code: `418${order}`, subCode: '$T01', lang: '$ULatn%%', value: `${x.length > 0 ? `$l${x}` : ''}` });
      });

      // Push the Japanese and Kana formatted strings into their respective arrays
      extraStuffJAP.push(headJap + temp);
      extraStuffKAN.push(headKan + temp);

    } else {
      // If head doesn't contain specific separators, format it directly and push 4018 records
      const temp = x.filter(x => x.length > 0).map((x, i) => {
        return i === 0 ? `$l${x}` : `$m${x}`;
      }).join('');
      
      x.forEach(x => {
        _4018.push({ code: `418${order}`, subCode: '$T01', lang: '$UJpan%%', value: `#J000,b,s#!PPN!${x.length > 0 ? `$l${x}` : ''}` });
        _4018.push({ code: `418${order}`, subCode: '$T01', lang: '$ULatn%%', value: `${x.length > 0 ? `$l${x}` : ''}` });
      });

      extraStuffJAP.push(temp);
      extraStuffKAN.push(temp);
    }
  });

  // Create 4017 record for the Japanese title and author, if available
  const _4017 = [TITLE_JAP ? 
    { code: `417${order}`, subCode: `$T01`, lang: `$UJpan%%`, value: `${TITLE_JAP}${AUTHOR_JAP ? `$h${AUTHOR_JAP}` : ''}${$tail}${extraStuffJAP.join('')}` } : null
  ].filter(Boolean);

  // Add the Kana-to-Latin transliterated 4017 record if there is a title or author
  if (_4017.length > 0) {
    _4017.push({ code: `417${order}`, subCode: '$T01', lang: '$ULatn%%', value: `${kanaToLatn(PTBTRR ? PTBTRR : '')}${kanaToLatn(AUTHOR_JAP ? `$h${AUTHOR_JAP}` : '')}${$tail}${extraStuffJAP.join('')}` });
  }

  // Combine the 0500, 4017, and 4018 records into the final result, filtering out null values
  const result = [_0500, _4017.length > 0 ? _4017 : null, _4018.length > 0 ? _4018 : null].flat().filter(Boolean);

  // Increment order if any records were generated
  if (result.length > 0) {
    order++;
  }

  // Return the sorted result or null if no records were generated
  return result.length === 0 ? null : result.sort(compare);
}

// Function to reset the global order counter
const reset = function() {
  order = 0;
}

// Export the parse and reset functions
export { parse, reset };
