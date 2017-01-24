/**
 * Created by tom on 12/01/2017.
 */

import * as locations from "./locations";
import * as regions from "./regions";
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
                        location: loc,
                        region: regions[loc.region]
                    };
                }
            });
            resolve(nearest);
        });
    }

    getDataForSiteId(siteId) {
        const fcsUri = "http://" + baseUri + "/val/wxfcs/all/json/" + siteId + "?res=3hourly&key=" + this.key;
        return fetch(fcsUri)
            .then((res) => {
                return res.json();
            });
    }

    getTextForRegionId(regionId) {
        const txtUri = "http://" + baseUri + "/txt/wxfcs/regionalforecast/json/" + regionId + "?key=" + this.key;
        return fetch(txtUri)
            .then((res) => {
                return res.json();
            });
    }

    getForecastForLatLng(latlng) {
        return new Promise((resolve, reject) => {
            let site;
            let data;
            let text;

            this.getNearestSiteToLatLng(latlng)
                .then((s) => {
                    site = s;
                    return this.getDataForSiteId(site.location.id);
                })
                .then((d) => {
                    data = d;
                    return this.getTextForRegionId(site.region.id);
                })
                .then((txt) => {
                    text = txt;
                    resolve(
                        {
                            site: site,
                            data: data,
                            text: text
                        }
                    );
                }).catch((err) => {
                reject(err);
            });
        });
    }

}