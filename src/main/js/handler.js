'use strict';

import Validator from "./validators/Validator";
import * as schema from "./schemas/request.json";
import Geocoder from "./geo/Geocoder";
import ManualDatapoint from "./datapoint/ManualDatapoint";
import JsonResponse from "./responses/JsonResponse";
import TextResponse from "./responses/TextResponse";
import * as HttpStatus from "http-status-codes";

const validator = new Validator(schema);
const geocoder = new Geocoder();
const datapoint = new ManualDatapoint();


module.exports.datapoint = (event, context, callback) => {

    if (event.queryStringParameters) {
        validator.validate(event.queryStringParameters)
            .then(() => {
                return geocoder.getLatLng(event.queryStringParameters.location)
            })
            .then((latlng) => {
                return datapoint.getNearestSiteToLatLng(latlng);
            })
            .then((loc) => {
                return datapoint.getForecastForSiteId(loc.location.id)
            })
            .then((fcst) => {
                callback(null, new JsonResponse(fcst));
            })
            .catch((err) => {
                callback(null, new TextResponse(err.toString(), HttpStatus.INTERNAL_SERVER_ERROR));
            });
    } else {
        callback(null, new JsonResponse({message: "missing location query param"}, HttpStatus.BAD_REQUEST));
    }

};
