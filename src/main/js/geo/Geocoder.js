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
    geocodeUK(locationString) {
        return this.googleMapsClient.geocode({address: locationString, region: "uk", language: "en"}).asPromise();
    }

    /**
     * Gets the lat & lng of the specified location string if it's found to be in the UK.
     * @param locationString location to geocode
     * @returns {Promise}
     */
    getLatLngUK(locationString) {
        return this.geocodeUK(locationString)
            .then((response) => {
                const result = response.json.results[0];
                if (result) {
                    return placeInUK(result);
                } else {
                    return Promise.reject("[" + locationString + "] could not be located");
                }
            }).then((result) => {
                return result.geometry.location;
            }).catch((err)=> {
                return Promise.reject(err);
            })
    }

};

const placeInUK = (result) => {
    return new Promise((resolve, reject) => {
        result.address_components.forEach((ac) => {
            console.log(ac.types.toString()+ " "+ ac.long_name);
            if (ac.long_name === "United Kingdom") {
                resolve(result);
            }
        });
        reject("[" + result.formatted_address + "] was located but is outside of the UK" );
    });
};