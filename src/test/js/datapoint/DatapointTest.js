/**
 * Created by tom on 11/01/2017.
 */
"use strict";

import {describe, before, it} from "mocha";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import Datapoint from "../../../../src/main/js/datapoint/Datapoint";


describe('Datapoint', () => {

    const exeter = {
        lat: 50.718412,
        lng: -3.533899
    };
    let datapoint;

    before(() => {
        datapoint = new Datapoint();
    });

    // it("gets the latest forecast for exeter", (done) => {
        // expect(datapoint.getForecastForLatLng(exeter)).to.eventually.be.ok.notify(done);
    // })

});