/**
 * Created by tom on 04/01/2017.
 */
"use strict";

import * as gmaps from "@google/maps";
import Q from "q";

export default class Geocoder {

    constructor() {
        this.googleMapsClient = gmaps.createClient({
            key: process.env.GOOGLE_MAPS_API_KEY,
            Promise: Q.Promise
        });
    }

    /**
     * Geocodes the given location string
     * @param locationString location to geocode
     * @returns {Promise}
     */
    geocode(locationString) {
        return this.googleMapsClient.geocode({address: locationString}).asPromise();
    }

    /**
     * Gets the lat & lng of the specified location string
     * @param locationString location to geocode
     * @returns {Promise}
     */
    getLatLng(locationString) {
        return this.geocode(locationString)
            .then((response) => {
                return response.json.results[0].geometry.location;
            });
    }

};