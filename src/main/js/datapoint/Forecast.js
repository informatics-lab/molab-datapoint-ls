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
                        code: "D",
                        value: timestep.D,
                        units: "16-point compass direction"
                    },
                    feelsLikeTemperature : {
                        name: "feels like temperature",
                        code: "F",
                        value: parseInt(timestep.F),
                        units: "°C"
                    },
                    windGust: {
                        name: "wind gust",
                        code: "G",
                        value: parseInt(timestep.G),
                        units: "mph"
                    },
                    screenRelativeHumidity: {
                        name: "screen relative humidity",
                        code: "H",
                        value: parseInt(timestep.H),
                        units: "%"
                    },
                    temperature: {
                        name: "temperature",
                        code: "T",
                        value: parseInt(timestep.T),
                        units: "°C"
                    },
                    visibility: {
                        name: "visibility",
                        code: "V",
                        value: {
                            index: timestep.V,
                            description: this.getVisibility(timestep.V)
                        }
                    },
                    windSpeed: {
                        name: "wind speed",
                        code: "S",
                        value: parseInt(timestep.S),
                        units: "mph"
                    },
                    maxUVIndex: {
                        name: "maximum ultra violet index",
                        code: "U",
                        value: {
                            index: timestep.U,
                            description: this.getUVIndex(timestep.U)
                        }
                    },
                    weatherType: {
                        name: "weather type",
                        code: "W",
                        value: {
                            index: timestep.W,
                            description: this.getWeatherType(timestep.W)
                        }
                    },
                    precipitationProbability: {
                        name: "precipitation probability",
                        code: "Pp",
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