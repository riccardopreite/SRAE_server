let express = require('express');
let router = express.Router();

const query_service = require('../service/query');

router.get('/sdi', async (req, res) => {
    const query = req.query;
    const user = query["user"]
    const name = query["name"]
    const indicator = JSON.parse(req.body["indicators"], function(key, value) {
        return value == 'None' ? NaN : value;
    });
    
    res.status(200).json(await query_service.getSDI(user, name, indicator)).send();
 
 
});
router.get('/predict', async (req, res) => {
    const query = req.query;
    const user = query["user"]
    const name = query["name"]
    const indicator = JSON.parse(req.body["indicators"], function(key, value) {
        return value == 'None' ? NaN : value;
    });
    const sdi = eval(query["sdi"])
    res.status(200).json(await query_service.getInput(user, name, indicator, sdi)).send();
    
    
});
module.exports = router;
