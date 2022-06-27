/* eslint-disable no-unused-vars */
const path = require('path');
const fs = require('fs');
const trained_template = require('../model/trained_template')
const template = require('../model/template')
const create_template = require('../model/create_template')
const superagent = require('superagent');
const TrainedTemplate = require('../model/trained_template');
const Query = require('../model/query');
const { type } = require('os');
class Persistence {

    static _root;
    static _api_url;

    /**
     * @type {string}
     */
    static set root(root) {
        this._root = root;
    }
    /**
     * @type {string}
     */
    static set api_url(api_url) {
        this._api_url = api_url;
    }

    /**
     * Retrieve template or list of template of user `user`
     * 
     * @param {string} user 
     * @param {string} name 
     */
    static async retrieveTemplate(user, name) {
        const user_path = path.join(this._root, 'users', user)
        if(!fs.existsSync(user_path)){
            return "User " + user + " doesn't have a template dir."
        }
        if (name === ""){
            const files = fs.readdirSync(user_path)
            var model_to_return = []
            for (let index in files){
                let file = files[index]
                if (file.includes('.pt')){
                    let file_name = file.replace('.pt','')
                    model_to_return.push(await retrieveCreateTemplate(user, file_name, this._api_url))
                }
            }
            return model_to_return
        }
        else{
            const files = fs.readdirSync(user_path)
            const matched = files.filter(file => file == name+".pt");
            if (matched.length > 0)
                return await retrieveCreateTemplate(user, name, this._api_url)
            else
                return "Model with name " + name + " doesn't exist."
            
        }
        
    }
    /**
     * Create template for user `user`
     * 
     * @param {string} user 
     * @param {string} name 
     * @param {object} indicators 
     * @param {object} tasks 
     * @param {object} macros 
     */
    static async createTemplate(user, name, indicators, tasks, macros, data_type, batch, mode, lr, ae_loss, is_early){
        const user_path = path.join(this._root, 'users', user)
        if(!fs.existsSync(user_path)){
            fs.mkdirSync(user_path);
        }

        /**
         * Implement python part to create model and save it to file
         */
        const new_template = new create_template(user, name, indicators, tasks, macros, data_type, batch, mode, lr, ae_loss, is_early)
        console.log(new_template.toJsObject());
        const result = await superagent.post(this._api_url + 'create').send(new_template.toJsObject());
        return result.text
    }
    
    /**
     * Eval `indicators`, with model `name`, to compute sdi or input for user `user` 
     * 
     * @param {string} user 
     * @param {string} name 
     * @param {object} indicators 
     */
    static async eval_input(user, name, indicators, sdi){
        if (! name.includes(".pt"))
            name = name+".pt" 
        const query = new Query(user, name, indicators, sdi)
        const endpoint = sdi != undefined ? 'predict' : 'sdi' 
        
        const result = await superagent.get(this._api_url + endpoint).send(query.toJsObject());
        const final = sdi != undefined ?  result.text :  isNaN(parseFloat(result.text)) ? result.text : parseFloat(result.text)
        return final
    }


}
/**
 * Retrieve trained model
 * 
 * @param {string} user Name of the user
 * @param {string} file_name Name of the template to retrieve
 * @param {string} api_url Url of the query
 * @param {string} current_template Current template to be found
 * @returns {TrainedTemplate} model_to_return 
*/
async function retrieveCreateTemplate(user, file_name, api_url) {
    let current_template = new template(user, file_name+".pt")
    const result = await superagent.get(api_url + 'retrieve').query(current_template);
    const weight_list = result.body
    return new trained_template(user, file_name, weight_list)
}

module.exports = Persistence;



