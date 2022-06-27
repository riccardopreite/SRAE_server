const { validatePrimitiveType } = require('../utils/validate-arguments');

class Template {
    /**
     * Constructs a friend request body.
     * 
     * @param {string} user name.
     * @param {string} name Template name.
     */
    constructor(user, name) {
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(name, 'string');
        
        this.user = user;
        this.name = name;
    }
}

module.exports = Template;