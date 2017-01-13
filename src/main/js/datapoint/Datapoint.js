/**
 * Created by tom on 11/01/2017.
 */

import * as D from "datapoint-js";

export default class Datapoint {

    constructor() {
        this.d = D;
        this.d.set_key(process.env.DATAPOINT_API_KEY);
    }

    getForecastForLatLng(latlng) {
        return new Promise((resolve, reject) => {
            const site = this.d.get_nearest_forecast_site(latlng.lat, latlng.lng);
            const forecast = this.d.get_forecast_for_site(site.id, "3hourly");
            const latest = forecast.days[0].timesteps[0];
            resolve(latest);
        });
    }
}