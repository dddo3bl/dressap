const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "testnode"
});

router.get('/user/:id',(req,res)=>{
    console.log("fetching user id"+req.params.id);
    const userid = req.params.id;
    var result ;
    db.query("select * from products where id = ? ",[userid],(err, rows, fields) =>{
        if(err){
            console.log("failed to quere for user"+err);
            res.status(400).json({
                massege:"error"
            });
        }
        
                
        console.log(" i think we fetched users ");
        // res.json(rows);
        const row = rows[0]["id"];
        db.query('select * from products where id = ?',[row],
        (err, resulr, fields)=>{
            console.log(result);
            console.log("test");
            res.json({
                secsses:"ok",
                data:rows
            })
        }
        )
        console.log(row);

    });
    
    console.log("ok");
}
);

router.get('/', (req, res, next) => {
    db.query('select * from products',
    (error,rows, fields)=>{
        if(error){
            console.log("failed to quere for user"+err);
            res.status(400).json({
                massege:"error"
            });
        }
        res.json(rows)
    }
    );
    // console.log(result);
    res.status(200).json({
        message : 'handling get request to /products'
    });
});

router.post('/', (req, res, next) => {
    const prodect = {
        name:req.body.name,
        price: req.body.price,
    };
    
    res.status(200).json({
        message : 'handling post request to /products',
        createproduct: prodect 
    });
});

router.get('/:prodeuctid', (req, res ,next) => {
    const id = req.params.prodeuctid;
    console.log(id);
    if (id === 'special'){
        res.status(200).json({
            message : 'ok that',
            id: id
        });
    }else{
        res.status(201).json({
            message:'not okk'
        });
    }
});

module.exports = router ;