/**
 * Created by tom on 09/01/2017.
 */
"use strict";

import {describe, before, it} from "mocha";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import Validator from "../../../../src/main/js/validators/Validator";
import * as schema from "../../../main/js/schemas/request.json";


describe('Validator', () => {

    let validator;

    before(() => {
        validator = new Validator(schema);
    });
    
    it("validates", (done) => {
        expect(validator.validate({location: "test"})).to.eventually.be.ok.notify(done);
    });

    it("fails", (done) => {
        expect(validator.validate({foo: "bar"})).to.eventually.be.rejected.notify(done);
    })
    
});