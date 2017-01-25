/**
 * Created by tom on 04/01/2017.
 */
"use strict";

import {describe, before, it} from "mocha";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import Geocoder from "../../../../src/main/js/geo/Geocoder";

describe('Geocoder', () => {

    let geocoder;

    before(() => {
        geocoder = new Geocoder();
    });

    // it('geocodes London', () => {
    //     return expect(geocoder.geocode('London')).to.eventually.not.be.empty;
    // }).timeout(1000);

    // it('gets the lat lon of London', (done) => {
    //     expect(geocoder.getLatLng('London')).to.eventually.deep.equal({
    //         lat: 51.5073509,
    //         lng: -0.1277583
    //     }).notify(done);
    // }).timeout(1000);

    // it('rejects Paris', (done) => {
    //     expect(geocoder.getLatLngUK('Paris')).to.eventually.be.rejected.notify(done);
    // }).timeout(1000);
    //
    it('accepts Exeter', (done) => {
        geocoder.getLatLngUK('Exeter').then((res)=>{console.log(res)});
        expect(geocoder.getLatLngUK('Exeter')).to.eventually.be.ok.notify(done);
    }).timeout(1000);
});