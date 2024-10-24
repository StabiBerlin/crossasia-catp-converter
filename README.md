# crossasia-catp-converter

It is an internal project that converting NACSIS’s cataloguing format CATP to PICA3. It is *not* fully interpet all fields in CATP. 

The program has two main parts. CATPToJSON.js will turn CATP records (*not* fully interpet) into JSON format.
The js files under picax folder are converting the JSON into plain text or HTML of PICA3 record. More complicated mapping rules are implmented under rules folder.

Please check test.js in sample folder for further usage.

## Prerequisites 
NodeJs v21

