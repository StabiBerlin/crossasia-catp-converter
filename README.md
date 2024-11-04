# crossasia-catp-converter

**crossasia-catp-converter** is a tool designed to convert NACSIS’s cataloging format (CATP) into PICA3 format. This tool is intended for internal use and does not fully interpret all CATP fields.

## Project Structure

The project consists of three main components:

1. **CATPToJSON.js**  
   Converts CATP records into JSON format. This script performs a partial interpretation of the CATP fields.

2. **jsonToPicaX.js**  
   Transforms the JSON records into PICA3 format, outputting either plain text or HTML.

3. **picax folder**  
   Contains JavaScript files with complex mapping rules for translating JSON into PICA3 records.

## Usage

For an example of usage, refer to `sample.js` in the `sample` folder.

## Prerequisites

- Node.js v21
