const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multer  = require('multer')();
// const upload  = multer({ storage: multer.memoryStorage() });

const db = mysql.createConnection({
    host : "sql4.freemysqlhosting.net",
    user : "sql4432813",
    database : "sql4432813",
    password: "sewZMpQMeb"
});


router.post('/singup',(req,res,next)=>{
    const singup = {
        password:req.body.password,
        email:req.body.email,
        username:req.body.username,
        phone:req.body.phone
    }
    console.log(singup["phone"])
    db.query('SELECT * FROM mobile_user WHERE email = ? ',[singup["email"]],(error, rows, fields)=>{
        if(error){
            console.log("failed to quere for user"+err);
            res.status(400).json({
                massege:"error"
            });
        }
        console.log(rows.length)
        if(rows.length === 0){
            db.query("insert into mobile_user(user_name, email, password, phone)values(?,?,?,?)",[singup["username"],singup["email"],singup["password"],singup["phone"]],(error,rows)=>{
                db.query('SELECT * FROM mobile_user WHERE email = ? ',[singup["email"]], (error,result)=>{
                    const userid = result[0]['user_mubile_id'];
                    db.query('INSERT INTO clintsize(mubile_user_id, clint_name, clint_phone) VALUES(?, ?, ?)',[userid,singup["username"],singup["phone"]])
                    res.status(220).json({
                        result
                    })
                });
            });
            
        }else{
            res.status(210).json({
                data:rows,
                message:"exict"
            })
        }
        
    });

});



router.post('/login',(req, res, next) => {
    const login = {
        password:req.body.password,
        email:req.body.email,
    }
    console.log(login);
    db.query("select * from mobile_user where email = ? and password = ?",[login["email"],login["password"]],(error,rows,fields)=>{
        if(error){
            res.json({
                message:"error"
            });
        }
        if(!rows[0]){
            console.log(rows[0]);
            res.status(210).json({
            message:'not ok'
            });
        }else{
            console.log(rows[0]);
            res.status(205).json({rows})
        }
        
    });
});

router.post('/personal',(req, res, next) => {
    const personalpr = {
        password:req.body.password,
        email:req.body.email,
        newemail:req.body.newemail,
        username:req.body.username,
        phone:req.body.phone
    }

    db.query('SELECT * FROM mobile_user WHERE email = ?',[personalpr["email"]], (error,rows,fields)=>{
        if(error){
            res.json({
                message:"not find"
            });
        }
        const userid = rows[0]['user_mubile_id'];
        db.query('UPDATE  mobile_user SET user_name = ? , email = ? , password = ?, phone = ? WHERE email = ?',[personalpr["username"],personalpr["newemail"],personalpr["password"],personalpr["phone"],personalpr["email"]]);
        db.query('UPDATE clintsize SET clint_name = ? , clint_phone = ?  WHERE mubile_user_id = ?',[personalpr["username"],personalpr["phone"],userid]);
        db.query('SELECT * FROM mobile_user WHERE email = ?',[personalpr["newemail"]],(error,result)=>{
            console.log(result);
            res.status(220).json(result);
        });
        
        
    });
});

router.post('/clintsize',(req,res,next)=>{
    const userid = req.body.userid;
    console.log(userid)
    db.query('SELECT * FROM clintsize WHERE mubile_user_id = ?',[userid],(error,row)=>{
        console.log(row[0]);
        res.json(row);
    });
});

router.post('/newclintsize',(req,res,next)=>{
    const sizes = {
        userid: req.body.userid,
        bttn:req.body.bttn,
        chist_whdth:req.body.chist_whdth,
        cholder:req.body.cholder,
        username:req.body.username,
        clint_phone:req.body.clint_phone,
        hand_length:req.body.hand_length,
        hand_whdth:req.body.hand_whdth,
        hight:req.body.hight,
        lower_part:req.body.lower_part,
        muscle:req.body.muscle,
        nick:req.body.nick,
        email:req.body.email,
    };
    db.query('UPDATE clintsize SET hight = ?, bttn = ?, cholder = ?, chist_whdth = ?, nick = ? , hand_whdth = ?, lower_part = ?, hand_length = ?, muscle = ? WHERE mubile_user_id = ?',
    [
        sizes["hight"],
        sizes["bttn"],
        sizes["cholder"],
        sizes["chist_whdth"],
        sizes["nick"],
        sizes["hand_whdth"],
        sizes["lower_part"],
        sizes["hand_length"],
        sizes["muscle"],
        sizes["userid"],
    ],(error, rows,fields)=>{
        if(error){
            res.status(220).json({
                message:"not ok"
            });
        }
        console.log("ok");
        res.status(210).json({
            message:"okk"
        });
    });
});


router.post('/updatesize',(req,res,next)=>{
    const updatesize = {
        userid: req.body.userid,
        bttn:req.body.bttn,
        chist:req.body.chist,
        cholder:req.body.cholder,
        arm:req.body.arm,
        res:req.body.res,
        hight:req.body.hight,
        lower:req.body.lower,
        muscle:req.body.muscle,
        nick:req.body.nick,
    }

    db.query('UPDATE clintsize SET hight = ? , bttn = ? , cholder = ? , chist_whdth = ? , nick = ? , hand_whdth = ?, lower_part = ?, hand_length = ?, muscle = ? WHERE mubile_user_id = ?',
    [
        updatesize["hight"],updatesize["bttn"],updatesize["cholder"],updatesize["chist"],updatesize["nick"],updatesize["res"],updatesize["lower"],updatesize["arm"],updatesize["muscle"],updatesize["userid"]
    ],
    (error, rows, fields)=>{
        if(error){
            console.log(error);
            res.status(220).json({
                message:"not ok"
            });
        }
        res.status(210).json({
            message:"ok"
        });
    });    
});

router.post('/ordersress',(req,res,next)=>{
    const order = {
        userid:req.body.userid,
        username:req.body.username,
        fabricid:req.body.fabricid,
        dressnum:req.body.dressnum,
        bttn:req.body.bttn,
        chist:req.body.chist,
        cholder:req.body.cholder,
        arm:req.body.arm,
        res:req.body.res,
        hight:req.body.hight,
        lower:req.body.lower,
        muscle:req.body.muscle,
        nick:req.body.nick,
    }
    // get dress info
    db.query('SELECT * FROM dress_type WHERE dress_id = ?',[order["dressnum"]],(error,row,fields)=>{
        var dressname = row[0]["dress_name"]
        // console.log(row);
        // console.log(dressname);
        // get fabric info
        db.query('SELECT * FROM fabrics WHERE fabric_id = ?',[order["fabricid"]],(error,row,fields)=>{
            var fabricname = row[0]["fabric_name"];
            var fabricMprice = row[0]["price_per_m"];
            var tax_amount = row[0]["tax_amount"];
            var color = row[0]["color"];
            // get total price
            var bttn = order["bttn"];
            var hight = order["hight"];
            var taxamount = row[0]["tax_amount"];
            var pricePerm = row[0]["price_per_m"];
            if(bttn <= 30){
                var nededsentemetr = hight*2;
                var nededmetrs = nededsentemetr/100                
                console.log("*1");
            }else if(bttn >= 31 && bttn <= 50){
                var nededsentemetr = hight * 2.80;
                var nededmetrs = nededsentemetr/100 
                console.log("*2")
            }
            var forplace = 100;
            var total_price = nededmetrs * pricePerm + taxamount + forplace;
            console.log(total_price);
            var mubile = 1;
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            console.log(dateTime);
            db.query('SELECT clint_id FROM clintsize WHERE mubile_user_id = ?',[order['userid']],(error,row,fields)=>{
                const clintsizeid = row[0]['clint_id'];
                
                db.query("insert into clint_order(clint_id ,clint_name, fabricid, mubile_id, mubile, fabriccolor, fabricname, total_price, dress_id, dress_type, order_time)values(? ,?, ?, ?, ?, ?, ?, ?, ?, ? ,?)",
                [
                    clintsizeid, order["username"], order["fabricid"], order["userid"], mubile, color, fabricname, total_price, order["dressnum"], dressname, dateTime
                ],
                (error,result,fields)=>{
                    if(error){
                        res.status(404).json({
                            message:"not ok"
                        });
                    }
                    res.status(572).json({
                        data:result,
                        message:"okk"
                    });
                });
            });

        });
    });
});


router.post('/status',(req,res,next)=>{
    const userid = req.body.userid;
    db.query('select clint_orderid, total_price,bayed,is_bayed, order_time from clint_order where mubile_id = ?',
    [userid],
    (error, result,fields)=>{
        if(error){
            res.status(404).json({
                message:"not ok"
            });
        }
        res.status(210).json(result);

    }
    )
});



router.post('/confirm',(req,res,next)=>{
    const invonum = req.body.ordernum;
    const userid = req.body.userid;
    const thebayment = req.body.thebaymnt;
    const imagename = req.body.imagename;
    const imageb1ase = req.body.imagebase;
    
     db.query('UPDATE clint_order SET is_bayed = 1, bayed = ? WHERE clint_orderid = ?',
     [thebayment, invonum],
     (error, row, fields)=>{
         if(error){
             res.status(404).json({
                 message:"error"
             });
         }   
     });
  
 db.query('insert into invo_imafe(image_name, image_coded, clint_order, mubile_clint )values(?, ?, ?, ?)',
 [
     imagename, imageb1ase, invonum, userid
 ],
 (error, row, fields)=>{
     if(error){
        //  console.log(error);
        res.status(404).json({
            message:"error",
            error
        });
     }
 }
 )
 res.status(200).json({
     message:"ok"
 })
});

router.get('/fabrics',(req,res,next)=>{
    db.query('SELECT fabric_id, fabric_name, price_per_m, color, tax_amount FROM fabrics',(error, rows, fields)=>{
        if(error){
            res.status(404).json({
                message:"not ok"
            });
        }
        res.status(200).json(rows);
    });
})

module.exports = router ;