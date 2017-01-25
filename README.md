# molab-datapoint-ls
User-friendly serverless endpoint for Met Office Datapoint API.

## Usage
method `GET` endpoint `<YOUR SERVICE ENDPOINT>/datapoint?location=<LOCATION>`  
* `location` query parameter is required.  


## Development
Requires API keys for Google Maps Geocoding Service and Met Office Datapoint.

## Compilation
Project src is written in ES6, transpiles to ES2015 in `./dist` directory.   
use `npm run compile`

## Deployment
Transpile and deploy this service to AWS Lambda; creates the function and an associated API Gateway endpoint for the function.  
use `npm run deploy`

## Testing
Tests using mocha and chai.  
use `npm test`


