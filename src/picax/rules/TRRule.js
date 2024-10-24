import { kanaToLatn } from '../../utils/KanaToLatn.js';  // Import utility to convert Kana to Latin characters
import { compare } from '../util.js';  // Import comparison function for sorting

// Utility function to split titles by ' / ' and then further split by ' ; ' to extract multiple titles
const splitTitles = (str) => str.split(' / ')[0].trim().split(' ; ');

const parse = function(value) {
    let records = [];  // Initialize an empty array to store the parsed records

    // Extract TRD (translated title) and TRR (romanized title) values from the input object
    const TRD = value.find(x => x.TRD)?.TRD || '';  // Find 'TRD' field or default to an empty string
    const TRR = value.find(x => x.TRR)?.TRR || '';  // Find 'TRR' field or default to an empty string
    
    // Split the TRD and TRR strings by ' . ' to separate multiple records
    const TRDRaws = TRD.split(' . ');
    const TRRRaws = TRR.split(' . ');

    let TRDMoreThanOne = TRDRaws.length > 1;  // Boolean flag to check if there are multiple TRD records
    let have4010 = false;  // Boolean flag to check if a 4010 code has been used

    // Iterate through each TRD record
    TRDRaws.forEach((TRD, i) => {
        const [TRDprimary, TRDparallel] = TRD.split(' = ');  // Split into primary and parallel titles
        const TRDprimaryTitles = splitTitles(TRDprimary);  // Extract primary titles
        TRDMoreThanOne = TRDMoreThanOne || TRDprimaryTitles.length > 1;  // Update flag if more than one title is present

        let TRDprimary$h = TRDprimary.split(' / ')[1] || null;  // Extract additional title info if present
        const TRDparallelTitles = TRDparallel ? TRDparallel.split(' / ')[0].split(' ; ') : [];  // Extract parallel titles if they exist
        let TRDparallel$h = TRDparallel ? TRDparallel.split(' / ')[1] || null : null;  // Extract additional info for parallel titles

        // If there's no primary title's additional info, use the parallel one
        if (!TRDprimary$h) {
            TRDprimary$h = TRDparallel$h;
            TRDparallel$h = null;
        }

        // Process each primary title
        TRDprimaryTitles.filter(title => title.length > 0).forEach((title, index) => {
            const _index = i + index;  // Calculate index for the current title

            // If there are multiple titles, push a 3211 code record
            if (TRDMoreThanOne) {
                const _indexPlusOne = _index + 1;  // Adjust index for record format
                records.push(`3211 $T${_indexPlusOne > 9 ? _indexPlusOne : `0${_indexPlusOne}`}$ULatn%%`);
                records.push({
                    code: 3211,
                    subCode: `$T${_indexPlusOne > 9 ? _indexPlusOne : `0${_indexPlusOne}`}`,
                    lang: `$UJpan%%`,
                    value: `${title.split(' : ')[0]}`
                });
            }

            // Add 4000 or 4010 record for the first title or subsequent ones
            if (_index === 0) {
                records.push(`4000 $T01$ULatn%%`);
                records.push({
                    code: 4000,
                    subCode: `$T01`,
                    lang: `$UJpan%%`,
                    value: `${title.replace(' : ', '$d')}${TRDprimary$h ? `$h${TRDprimary$h}` : ''}`
                });
            } else {
                have4010 = true;  // Set flag indicating 4010 code was used
                records.push(`4010 $T0${_index}$ULatn%%`);
                records.push({
                    code: 4010,
                    subCode: `$T0${_index}`,
                    lang: `$UJpan%%`,
                    value: `${title.replace(' : ', '$d')}${TRDprimary$h ? `$h${TRDprimary$h}` : ''}`
                });
            }
        });

        // Process each parallel title and add 4002 code record
        TRDparallelTitles.filter(title => title.length > 0).forEach((title) => {
            records.push({
                code: 4002,
                subCode: ``,
                lang: ``,
                value: `${title.replace(' : ', '$d')}${TRDparallel$h ? `$h${TRDparallel$h}` : ''}`
            });
        });
    });

    // Process TRR records similarly as above
    let TRRMoreThanOne = TRRRaws.length > 1;  // Check if there are multiple TRR records
    TRRRaws.forEach((TRR, i) => {
        const TRRprimary = TRR.split(' = ')[0];  // Extract the primary romanized title
        const TRRprimaryTitles = splitTitles(TRRprimary);  // Split romanized titles
        TRRMoreThanOne = TRRMoreThanOne || TRRprimaryTitles.length > 1;  // Update flag for multiple titles
        const TRRprimary$h = TRRprimary.split(' / ')[1] || null;  // Extract additional info if present

        // Process each romanized primary title
        TRRprimaryTitles.filter(title => title.length > 0).forEach((title, index) => {
            const _index = i + index;

            // Update or add 3211 records for romanized titles
            if (TRRMoreThanOne) {
                const _indexPlusOne = _index + 1;
                records[records.indexOf(`3211 $T${_indexPlusOne > 9 ? _indexPlusOne : `0${_indexPlusOne}`}$ULatn%%`)] = {
                    code: 3211,
                    subCode: `$T${_indexPlusOne > 9 ? _indexPlusOne : `0${_indexPlusOne}`}`,
                    lang: `$ULatn%%`,
                    value: `${kanaToLatn(title.split(' : ')[0])}`
                };
                records.push({
                    code: 3211,
                    subCode: `$T${_indexPlusOne > 9 ? _indexPlusOne : `0${_indexPlusOne}`}`,
                    lang: `$UKana%%`,
                    value: `${title.split(' : ')[0]}`
                });
            }

            // Update or add 4000 and 4010 records for the romanized title
            if (_index === 0) {
                records[records.indexOf(`4000 $T01$ULatn%%`)] = {
                    code: 4000,
                    subCode: `$T01`,
                    lang: `$ULatn%%`,
                    value: `${kanaToLatn(title.replace(' : ', '$d'))}`
                };
                records.push({
                    code: 4000,
                    subCode: `$T01`,
                    lang: `$UKana%%`,
                    value: `${title.replace(' : ', '$d')}${TRRprimary$h ? `$h${TRRprimary$h}` : ''}`
                });
            } else {
                have4010 = true;
                records[records.indexOf(`4010 $T0${_index}$ULatn%%`)] = {
                    code: 4010,
                    subCode: `$T0${_index}`,
                    lang: `$ULatn%%`,
                    value: `${kanaToLatn(title.replace(' : ', '$d'))}`
                };
            }
        });
    });

    // Clean up the records by removing falsy values and sorting them using the compare function
    records = records.filter(Boolean).filter(x => typeof x != 'string').flat().sort(compare);

    // If 4010 code was used, prepend a 0599 record at the beginning
    if (have4010) {
        records.unshift({ code: '0599', value: `SLoT` });
    }

    return records;  // Return the parsed and sorted records
};

export { parse };  // Export the parse function
