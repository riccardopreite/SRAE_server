/* eslint-disable no-unused-vars */
const { validatePrimitiveType } = require('../utils/validate-arguments');

const Persistence = require('../persistence/persistence');

class TemplateService {
    /**
     * Gets the template or list of template of `user`.
     * 
     * @param {string} user The user of which the list must be retrieved.
     * @param {string} name Name of template.
     * @returns a list of `Template` or a template. 
     */
    static async retrieveTemplate(user, name) {
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(name, 'string');
        return await Persistence.retrieveTemplate(user, name)

    }
    /**
     * Create the templates for user `user` with name `name` and information
     * given from `indicators`, `tasks` and `macros`
     * 
     * @param {string} user The user of which the list must be retrieved.
     * @param {string} name Name of template.
     * @param {string} indicators List of indicators choosen from user.
     * @param {string} tasks List of tasks choosen from user.
     * @param {string} macros List of macros choosen from user.
     * @returns a list of `Template` or a template. 
     */
    static async createTemplate(user, name, indicators, tasks, macros, data_type, batch, mode, lr, ae_loss, is_early){
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(indicators, 'object');
        validatePrimitiveType(tasks, 'object');
        validatePrimitiveType(macros, 'object');
        validatePrimitiveType(is_early, 'boolean');
        
        return await Persistence.createTemplate(user, name, indicators, tasks, macros, data_type, batch, mode, lr, ae_loss, is_early)
    }

}

module.exports = TemplateService;