/**
 * Created by tom on 04/01/2017.
 */

import * as Immutable from "immutable";
import * as HttpStatus from "http-status-codes";

export default class TextResponse {

    constructor(body = "", statusCode = HttpStatus.OK, headers = new Immutable.Map()) {

        this.statusCode = statusCode;

        if(headers.get("Content-type") && headers.get("Content-type") == "text/plain") {
            this.headers = headers.toJS();
        } else {
            this.headers = headers.set("Content-type", "text/plain").toJS();
        }

        this.body = body;
    }

}

