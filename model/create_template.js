const { validatePrimitiveType } = require('../utils/validate-arguments');
const Template = require("./template")
class CreateTemplate {
    /**
     * Constructs a friend request body.
     * 
     * @param {string} user name.
     * @param {string} name Template name.
     * @param {string} indicator number of indicator.
     * @param {string} task number of task.
     * @param {string} macro number of macro.
     */
    constructor(user, name, indicator, task, macro, data_type, batch, mode, lr, ae_loss, is_early) {
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(indicator, 'object');
        validatePrimitiveType(task, 'object');
        validatePrimitiveType(macro, 'object');
        validatePrimitiveType(is_early, 'boolean');
        if (data_type != "imputer" && data_type != "mean" && data_type != "median"){
            data_type = "imputer"
        }
        validatePrimitiveType(data_type, 'string');


        this.template = new Template(user, name)
        this.indicator = indicator;
        this.task = task;
        this.macro = macro;
        /**
         * Develope purpose only
         * 
         */
        this.data_type = data_type;
        this.batch = batch;
        this.mode = mode;
        this.lr = lr;
        this.ae_loss = ae_loss;
        this.is_early = is_early;
        
    }
    toJsObject() {
        return {
            template: this.template,
            indicator: this.indicator,
            task: this.task,
            macro: this.macro,
            data_type: this.data_type,
            batch: this.batch,
            mode: this.mode,
            lr: this.lr,
            ae_loss: this.ae_loss,
            is_early: this.is_early
        };
    }
}

module.exports = CreateTemplate;