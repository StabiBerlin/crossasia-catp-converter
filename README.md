# crossasia-catp-converter
It is an internal project that converts NACSIS’s cataloguing format CATP to PICA3. It does *not* fully interpret all fields in CATP.

The program has three main parts. `CATPToJSON.js` will turn CATP records (*not* fully interpreting) into JSON format.
`jsonToPicaX.js` converts the JSON into plain text or HTML of a PICA3 record. The JavaScript files under the `picax` folder contain complex mapping rules.

Please check test.js in the sample folder for further usage.

## Prerequisites 
NodeJs v21

