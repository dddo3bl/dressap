const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');


const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "testnode"
});

// Routes which Handel request
const productRouters = require('./api/routes/products');
const ordrstRouters = require('./api/routes/orders');
const newClinttRouters = require('./api/routes/new_clint');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true, limit: '50mb',parameterLimit: 500000}));
app.use(bodyParser.json({limit:"50mb"}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELET, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products',productRouters);
app.use('/orders',ordrstRouters);
app.use('/newclint',newClinttRouters);

// handel errors
app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;