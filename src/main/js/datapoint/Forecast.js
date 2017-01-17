/**
 * Created by tom on 16/01/2017.
 */

import * as moment from "moment";
import * as visibilities from "./visibilities";
import * as weatherTypes from "./weatherTypes";
import * as uvIndexes from "./uvIndexes";

export default class Forecast {

    constructor() {
    }

    static buildFromResponse(datapointResponse) {
        let f = new Forecast();
        f["site"] = {};
        f.site["id"] = datapointResponse.SiteRep.DV.Location.i;
        f.site["name"] = datapointResponse.SiteRep.DV.Location.name;
        f.site["country"] = datapointResponse.SiteRep.DV.Location.country;
        f.site["continent"] = datapointResponse.SiteRep.DV.Location.continent;
        f.site["latitude"] = parseFloat(datapointResponse.SiteRep.DV.Location.lat);
        f.site["longitude"] = parseFloat(datapointResponse.SiteRep.DV.Location.lon);
        f.site["elevation"] = parseFloat(datapointResponse.SiteRep.DV.Location.elevation);
        f["forecast"] = this.mapResponseData(datapointResponse.SiteRep.DV.Location.Period);
        return f;
    }

    static mapResponseData(array) {
        let data = [];
        array.forEach((day)=> {
            day.Rep.forEach((timestep)=> {
                let dayDate = moment.utc(day.value.substring(0, day.value.length-1));
                let ts = {
                    dateTime : dayDate.add(timestep.$, "m").format(),
                    windDirection : {
                        name: "wind direction",
                        value: timestep.D,
                        units: "16-point compass direction"
                    },
                    feelsLikeTemperature : {
                        name: "feels like temperature",
                        value: parseInt(timestep.F),
                        units: "°C"
                    },
                    windGust: {
                        name: "wind gust",
                        value: parseInt(timestep.G),
                        units: "mph"
                    },
                    screenRelativeHumidity: {
                        name: "screen relative humidity",
                        value: parseInt(timestep.H),
                        units: "%"
                    },
                    temperature: {
                        name: "temperature",
                        value: parseInt(timestep.T),
                        units: "°C"
                    },
                    visibility: {
                        name: "visibility",
                        value: {
                            index: timestep.V,
                            description: this.getVisibility(timestep.V)
                        }
                    },
                    windSpeed: {
                        name: "wind speed",
                        value: parseInt(timestep.S),
                        units: "mph"
                    },
                    maxUVIndex: {
                        name: "maximum ultra violet index",
                        value: {
                            index: timestep.U,
                            description: this.getUVIndex(timestep.U)
                        }
                    },
                    weatherType: {
                        name: "weather type",
                        value: {
                            index: timestep.W,
                            description: this.getWeatherType(timestep.W)
                        }
                    },
                    precipitationProbability: {
                        name: "precipitation probability",
                        value: parseInt(timestep.Pp),
                        units: "%"
                    }
                };
                data.push(ts);
            });
        });
        return data;
    }

    static getWeatherType(index) {
        return weatherTypes[index];
    }

    static getVisibility(index) {
        return visibilities[index];
    }

    static getUVIndex(index) {
        return uvIndexes[index];
    }

}