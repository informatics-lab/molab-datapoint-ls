/**
 * Created by tom on 16/01/2017.
 */

import * as moment from "moment";
import * as visibilities from "./visibilities";
import * as weatherTypes from "./weatherTypes";
import * as uvIndexes from "./uvIndexes";

/**
 * GeoJSON forecast feature
 */
export default class Forecast {

    constructor() {
    }

    /**
     * method expects...
     *
     * {
     *    site: datapoint site,
     *    data: datapoint data response,
     *    text: datapoint text response,
     * }
     *
     * @param datapointResponses
     * @returns {Forecast}
     */
    static buildFromDatapointResponses(datapointResponses) {
        let f = new Forecast();
        f["type"] = "Feature";

        f["geometry"] = {};
        f.geometry["type"] = "Point";
        f.geometry["coordinates"] = new Array();
        f.geometry.coordinates.push(parseFloat(datapointResponses.data.SiteRep.DV.Location.lat));
        f.geometry.coordinates.push(parseFloat(datapointResponses.data.SiteRep.DV.Location.lon));

        f["properties"] = {};
        f.properties["site"] = {};
        f.properties.site["id"] = datapointResponses.data.SiteRep.DV.Location.i;
        let name = datapointResponses.data.SiteRep.DV.Location.name.toUpperCase();
        f.properties.site["name"] = name;
        f.properties.site["region"] = datapointResponses.site.region.name.toUpperCase();
        f.properties.site["country"] = datapointResponses.data.SiteRep.DV.Location.country.toUpperCase();
        f.properties.site["continent"] = datapointResponses.data.SiteRep.DV.Location.continent.toUpperCase();
        f.properties.site["elevation"] = parseFloat(datapointResponses.data.SiteRep.DV.Location.elevation);
        let data = this.mapDataResponse(datapointResponses.data.SiteRep.DV.Location.Period);
        f.properties["forecast"] = {};
        f.properties.forecast["text"] = {};
        f.properties.forecast.text["regional"] = this.mapRegionalTextResponse(datapointResponses.text);
        f.properties.forecast.text["local"] = this.createLocalTextResponse(data, name);

        f.properties.forecast["current"] = data.shift();
        f.properties.forecast["future"] = data;

        return f;
    }

    static createLocalTextResponse(fcstArray, name) {


        let str = "Locally, for " + upperCaseFirst(name.toLowerCase()) + ". ";

        let tommorrow = new moment.utc().endOf('day');
        let todaysFcsts = fcstArray.filter((fcst) => {
            let dt = new moment.utc(fcst.dateTime);
            if (dt.isBefore(tommorrow)) {
                return true;
            }
            return false;
        });

        let summary = {
            maxTemp: Number.MIN_SAFE_INTEGER,
            maxFeelsLike: Number.MIN_SAFE_INTEGER,
            minTemp: Number.MAX_SAFE_INTEGER,
            minFeelsLike: Number.MAX_SAFE_INTEGER,
            probPrecip: Number.MIN_SAFE_INTEGER,
            maxWindSpeed: Number.MIN_SAFE_INTEGER,
            weatherType: [],
            visibility: [],
            windDirection: []
        };

        todaysFcsts.forEach((fcst)=> {

            if (fcst.temperature.value > summary.maxTemp) {
                summary.maxTemp = fcst.temperature.value;
                summary.maxFeelsLike = fcst.feelsLikeTemperature.value;
            }

            if (fcst.temperature.value < summary.minTemp) {
                summary.minTemp = fcst.temperature.value;
                summary.minFeelsLike = fcst.feelsLikeTemperature.value;
            }

            if (fcst.precipitationProbability.value > summary.probPrecip) {
                summary.probPrecip = fcst.precipitationProbability.value;
            }

            if (fcst.windSpeed.value > summary.maxWindSpeed) {
                summary.maxWindSpeed = fcst.windSpeed.value;
            }

            summary.weatherType.push(fcst.weatherType);
            summary.visibility.push(fcst.visibility);
            summary.windDirection.push(fcst.windDirection);

        });


        summary.weatherType = mode(summary.weatherType).value.description;
        summary.visibility = mode(summary.visibility).value.description;
        summary.windDirection = mode(summary.windDirection).value.substr(0,1).toUpperCase();
        
        const windDirs = {
            S: "Southerly",
            N: "Northerly",
            E: "Easterly",
            W: "Westerly"
        };

        str = str + "Today, temperatures will reach a high of " + summary.maxTemp + "\u00B0C with a minimum temperature of " + summary.minTemp+ " expected. ";
        str = str + "Given the other conditions today this will feel like " + summary.maxFeelsLike +"\u00B0C at its peak. ";
        if(summary.maxWindSpeed > 0) {
            str = str + windDirs[summary.windDirection] + " winds will reach a maximum of " + summary.maxWindSpeed + "mph. "
        }

        let split = summary.visibility.split("-");
        if(split.length === 2) {
            str = str + "Visibility is expected to be " + split[0].trim().toLowerCase() + " with a range of " + split[1].trim().toLowerCase() + ". ";
        } else if (split.length === 3) {
            str = str + "Visibility is expected to be " + split[0].trim().toLowerCase() + " with a range of " + split[1].trim().toLowerCase() + " and " + split[2].trim().toLowerCase() + ".";
        }

        str = str + "There is a " + summary.probPrecip + "% chance of precipitation.";

        console.log(str);

        return str;
    }

    static mapDataResponse(array) {
        let data = [];
        let now = new moment.utc();
        array.forEach((day)=> {
            day.Rep.forEach((timestep)=> {
                let tsDateTime = new moment.utc(day.value.substring(0, day.value.length - 1)).add(timestep.$, "m");
                if (new moment.utc(tsDateTime).add(3, "h").isAfter(now)) {
                    let ts = {
                        dateTime: tsDateTime.format(),
                        windDirection: {
                            name: "wind direction",
                            value: timestep.D,
                            units: "16-point compass direction"
                        },
                        feelsLikeTemperature: {
                            name: "feels like temperature",
                            value: parseInt(timestep.F),
                            units: "\u00B0C"
                        },
                        windGust: {
                            name: "wind gust",
                            value: parseInt(timestep.G),
                            units: "mph"
                        },
                        screenRelativeHumidity: {
                            name: "screen relative humidity",
                            value: parseInt(timestep.H),
                            units: "\u0025"
                        },
                        temperature: {
                            name: "temperature",
                            value: parseInt(timestep.T),
                            units: "\u00B0C"
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
                            units: "\u0025"
                        }
                    };
                    data.push(ts);
                }
            });
        });
        return data;
    }

    static mapRegionalTextResponse(text) {
        const current = text.RegionalFcst.FcstPeriods.Period[0];

        let str = "Regionally.";

        for (let i = 1; i < current.Paragraph.length - 1; i++) {
            let s = current.Paragraph[i].$;
            s = s.slice(0, s.slice(0, -1).lastIndexOf(".")) + ".";
            str = str + " " + s;
        }

        let end = current.Paragraph[current.Paragraph.length - 1].$;
        end = end.slice(0, end.slice(0, -1).lastIndexOf(".")) + ".";
        str = str + " Tomorrow. ";
        str = str + end;
        return str;
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

function mode(arr) {
    return arr.sort((a, b) =>
        arr.filter(v => v === a).length
        - arr.filter(v => v === b).length
    ).pop();
}

function upperCaseFirst(str){
    return str.charAt(0).toUpperCase() + str.substring(1);
}