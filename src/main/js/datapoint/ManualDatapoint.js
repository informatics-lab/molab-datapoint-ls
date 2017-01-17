/**
 * Created by tom on 12/01/2017.
 */

import * as locations from "./locations";
import haversine from "haversine";
import fetch from "node-fetch";

const baseUri = "datapoint.metoffice.gov.uk/public/data";

export default class ManualDatapoint {

    constructor() {
        this.key = process.env.DATAPOINT_API_KEY;
    }

    getNearestSiteToLatLng(latlng) {
        return new Promise((resolve, reject) => {
            let nearest = {
                dist: Number.MAX_VALUE
            };
            locations.forecastSites.forEach((loc) => {
                const dist = haversine(
                    {latitude: latlng.lat, longitude: latlng.lng},
                    {latitude: parseFloat(loc.latitude), longitude: parseFloat(loc.longitude)});
                if (dist < nearest.dist) {
                    nearest = {
                        dist: dist,
                        location: loc
                    };
                }
            });
            //TODO check distance here and reject if too far?
            resolve(nearest);
        });
    }

    getForecastForSiteId(id) {
        const fcsUri = "http://" + baseUri + "/val/wxfcs/all/json/" + id + "?res=3hourly&key=" + this.key;
        return fetch(fcsUri)
                .then((res) => {
                    return res.json();
                });
    }

}