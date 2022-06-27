/* eslint-disable no-unused-vars */
const { validatePrimitiveType } = require('../utils/validate-arguments');

const superagent = require('superagent');
const query = require('../model/query')

const Persistence = require('../persistence/persistence');

class QueryService {
    /**
     * Predict the sdi from indicators with model `name`.
     * 
     * @param {string} user The user of which the list must be retrieved.
     * @param {string} name Name of template.
     * @param {object} indicators List of values for the indicatos.
     * @returns a list of `Template` or a template. 
     */
    static async getSDI(user, name, indicators) {
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(indicators, 'object');
        
        if (name === "")
            return "Must pass a template name"
        else if (indicators.length === 0)
            return "Must pass the right indicators"
        else{
            return Persistence.eval_input(user, name, indicators, undefined)
        }
    }

    /**
     * Predict the input from indicators and sdi with model `name`.
     * 
     * @param {string} user The user of which the list must be retrieved.
     * @param {string} name Name of template.
     * @param {object} indicators List of values for the indicatos.
     * @param {number} sdi Value of the sdi that the user want to reach.
     * @returns a list of `Template` or a template. 
     */
    static async getInput(user, name, indicators, sdi){
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(indicators, 'object');
        validatePrimitiveType(sdi, 'number');
        if (name === "")
            return "Must pass a template name"
        else if (indicators.length === 0)
            return "Must pass the right indicators"
        else{
            return Persistence.eval_input(user, name, indicators, sdi)
        }   
    }
}

module.exports = QueryService;