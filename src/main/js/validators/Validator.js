/**
 * Created by tom on 09/01/2017.
 */

import * as JsonSchema from "jsonschema";

/**
 * Universal validator
 */
export default class Validator {
    
    constructor (schema) {
        this.schema = schema;
        this.validator = new JsonSchema.Validator();
    }

    /**
     * Validates the given object against the schema used to construct this object.
     * @param object - the object to validate
     * @returns {Promise}
     */
    validate (obj) {
        return new Promise(
            (resolve, reject) => {
                var valid = this.validator.validate(obj, this.schema);
                if (valid.errors.length == 0) {
                    resolve(true);
                } else {
                    reject(valid.errors);
                }
            }
        );
    }

}