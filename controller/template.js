let express = require('express');
let router = express.Router();

const template_service = require('../service/template');

router.get('/', async (req, res) => {
    const query = req.query;
    const user = query["user"]
    const name = query["name"]
    res.status(200).json(await template_service.retrieveTemplate(user, name)).send();
 
 
});
router.post('/create', async (req, res) => {
    const query = req.query;
    const user = query["user"]
    const name = query["name"]
    const indicator = eval(query["indicators"])
    const tasks = eval(query["task"]) 
    const macros = eval(query["macro"])
    const data_type = query["data_type"]
    const batch = query["batch"]
    const mode = query["mode"]
    const lr = query["lr"]
    const ae_loss = query["ae_loss"]
    const is_early = eval(query["is_early"])

    
    res.status(200).json(await template_service.createTemplate(user, name, indicator, tasks, macros, data_type, batch, mode, lr, ae_loss, is_early)).send();
    
    
});
module.exports = router;
