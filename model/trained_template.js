const { validatePrimitiveType } = require('../utils/validate-arguments');

class TrainedTemplate {
    /**
     * Constructs a friend request body.
     * 
     * @param {string} user name.
     * @param {string} name Template name.
     */
    constructor(user, name, weight) {
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(weight, 'object');
        
        this.user = user;
        this.name = name;
        this.weight = weight;
    }
}

module.exports = TrainedTemplate;