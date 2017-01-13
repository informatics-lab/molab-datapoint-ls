"use strict";

import {describe, before, it} from "mocha";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import ManualDatapoint from "../../../../src/main/js/datapoint/ManualDatapoint";

describe('ManualDatapoint', () => {

    const exeter = {
        lat: 50.718412,
        lng: -3.533899
    };

    const siteId = "310069";
    
    let datapoint;

    before(() => {
        datapoint = new ManualDatapoint();
    });

    it("gets the closest forecast site to exeter", () => {
        expect(datapoint.getNearestSiteToLatLng(exeter)).to.have.deep.property("location.id", "310069");
    });

    it("gets the forecast for a given site", (done) => {
        datapoint.getForecastForSiteId(siteId)
            .then((json) => {
                console.log(json);
                done();
            })
            .catch((err) => {
                console.log(err);
            })
        
    }).timeout(1000);
});
