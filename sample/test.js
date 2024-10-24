import { readFileSync } from 'node:fs';
import {CAPTParse, PICAXRewrite} from '../src/index.js'

function parseTextToArray(inputText) {
    // Split the text by line breaks
    const lines = inputText.split(/\r?\n/);
    
    let result = [];
    let tempArray = [];

    lines.forEach(line => {
        // If the line is not empty or contains only spaces, add it to the current group
        if (line.trim() !== "") {
            tempArray.push(line.trim());
        } else if (tempArray.length > 0) {
            // When encountering an empty line and tempArray has values, push the group to result
            result.push(tempArray);
            tempArray = [];
        }
    });

    // Push the last group if any exists (in case the input doesn't end with an empty line)
    if (tempArray.length > 0) {
        result.push(tempArray);
    }

    return result;
}
const catpRecords = parseTextToArray(readFileSync('sample.txt', "utf-8"))
const PICAXRecords = catpRecords.map(record =>  PICAXRewrite(CAPTParse(record)))
const translatedText = PICAXRecords.map(record => record.join('\n')).join('\n\n\n')
console.log(translatedText)
