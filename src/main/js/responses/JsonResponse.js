/**
 * Created by tom on 04/01/2017.
 */

import * as Immutable from "immutable";
import * as HttpStatus from "http-status-codes";

export default class JsonResponse {

    constructor(body = {}, statusCode = HttpStatus.OK, headers = new Immutable.Map()) {

        this.statusCode = statusCode;

        if(headers.get("Content-type") && headers.get("Content-type") == "application/json") {
            this.headers = headers.toJS();
        } else {
            this.headers = headers.set("Content-type", "application/json").toJS();
        }

        this.body = JSON.stringify(body);
    }

}

