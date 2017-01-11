'use strict';

import Validator from "./validators/Validator";
import * as schema from "./schemas/request.json";
import JsonResponse from "./responses/JsonResponse";
import TextResponse from "./responses/TextResponse";
// import Geocoder from "./geo/Geocoder";

const validator = new Validator(schema);
// const geocoder = new Geocoder();

module.exports.datapoint = (event, context, callback) => {

    console.log(event); // Contains incoming request data (e.g., query params, headers and more)
    console.log(context);
    console.log(callback);

    if (event.queryStringParameters) {
        validator.validate(event.queryStringParameters)
            .then(() => {
                callback(null, new JsonResponse({valid:"ok"}));
            })
            .catch((err) => {
                callback(null, new TextResponse(err.toString()));
            });
    } else {
        callback(null, new JsonResponse({message: "no query string found!"}));
    }

};
