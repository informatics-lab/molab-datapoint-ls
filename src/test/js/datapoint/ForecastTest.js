/**
 * Created by tom on 17/01/2017.
 */
"use strict";

import {describe, before, it} from "mocha";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import Forecast from "../../../../src/main/js/datapoint/Forecast";
import * as datapointResponse from "../../resources/datapoint";

chai.use(chaiAsPromised);

describe("Forecast", () => {

    it("maps the data to a forecast", () => {
        const f = Forecast.buildFromResponse(datapointResponse);
        expect(f).to.be.an("object");
    });

});