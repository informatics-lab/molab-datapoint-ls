'use strict';

import Validator from "./validators/Validator";
import * as schema from "./schemas/request.json";

import JsonResponse from "./responses/JsonResponse";
import TextResponse from "./responses/TextResponse";

import Geocoder from "./geo/Geocoder";


const validator = new Validator(schema);
const geocoder = new Geocoder();


module.exports.datapoint = (event, context, callback) => {

    if (event.queryStringParameters) {
        validator.validate(event.queryStringParameters)
            .then(() => {
                return geocoder.getLatLng(event.queryStringParameters.location)
            })
            .then((latlng) => {
                const response = {
                    location: event.queryStringParameters.location,
                    latlng: latlng
                };
                callback(null, new JsonResponse(response))
            })
            .catch((err) => {
                callback(null, new TextResponse(err.toString()));
            });
    } else {
        callback(null, new JsonResponse({message: "missing location query param"}));
    }

};
