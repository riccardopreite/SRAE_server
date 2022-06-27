const path = require("path");
const express = require('express');
const app = express(),
      bodyParser = require("body-parser");

const environment = require('./config/environment');
const port = parseInt(environment.serverPort);
environment.printConfiguration();

const persistence = require('./persistence/persistence');
persistence.api_url = environment.api_url
persistence.root = __dirname

const { template, query } = require('./controller');

app.use(bodyParser.json());
app.use(express.static(process.cwd()));
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.get('/', (req,res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
}); 
app.use('/template', template);
app.use('/query', query);

app.get("*", (req, res) => {
    var ext = path.extname(req.url);
    if (ext === ".html" ) {
        res.sendFile(path.join(__dirname,'assets','html',req.path))
    } 
    else if(ext === ".css"){
        res.sendFile(path.join(__dirname,'assets','css',req.path))
    }
    else if(ext === ".js"){
        res.sendFile(path.join(__dirname,'assets','js',req.path))
    }
    else if(ext === ".ico" || ext === ".jpg"){
        res.sendFile(path.join(__dirname,'assets','img',req.path))
    }
    else{
        console.log("Requested unknown file", req.path)
        res.end()
    }
  });


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});