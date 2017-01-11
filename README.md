# molab-datapoint-ls
User-friendly serverless endpoint for Met Office Datapoint API

## Development
Load in the various required API keys
use `source credentials.sh`

## Compilation
Project src is written in ES6, compiles to ES2015 in `./dist` directory.   
use `npm run compile`

## Deployment
Compile and deploy this service to AWS Lambda; creates the function and an associated API Gateway endpoint for the function.
use `npm run deploy`

## Testing
Tests using mocha.  
use `npm test`


