const { validatePrimitiveType } = require('../utils/validate-arguments');

class Query {
    /**
     * Constructs a friend request body.
     * 
     * @param {string} user name.
     * @param {string} name Template name.
     */
    constructor(user, name, indicators, sdi) {
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(indicators, 'object');      
        if(! Number.isNaN(sdi) && sdi != undefined)
            validatePrimitiveType(sdi, 'number');
        
        this.user = user;
        this.name = name;
        this.indicators = indicators;
        this.sdi = sdi;
    }
    toJsObject() {
        return {
            user: this.user,
            name: this.name,
            indicators: this.indicators,
            sdi: this.sdi
        };
    }
}

module.exports = Query;