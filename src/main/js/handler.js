'use strict';

import Validator from "./validators/Validator";
import * as schema from "./schemas/request.json";
import Geocoder from "./geo/Geocoder";
import ManualDatapoint from "./datapoint/ManualDatapoint";
import JsonResponse from "./responses/JsonResponse";
import TextResponse from "./responses/TextResponse";
import * as HttpStatus from "http-status-codes";
import Forecast from "./datapoint/Forecast";

const validator = new Validator(schema);
const geocoder = new Geocoder();
const datapoint = new ManualDatapoint();


module.exports.datapoint = (event, context, callback) => {

    if (event.queryStringParameters) {
        validator.validate(event.queryStringParameters)
            .then(() => {
                return geocoder.getLatLngUK(event.queryStringParameters.location)
            })
            .then((latlng) => {
                return datapoint.getForecastForLatLng(latlng);
            })
            .then((resp) => {
                callback(null, new JsonResponse(Forecast.buildFromDatapointResponses(resp)));
            })
            .catch((err) => {
                callback(null, new TextResponse(err.toString(), HttpStatus.INTERNAL_SERVER_ERROR));
            });
    } else {
        callback(null, new JsonResponse({message: "missing location query param"}, HttpStatus.BAD_REQUEST));
    }

};
