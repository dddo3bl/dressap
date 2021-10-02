const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multer  = require('multer')();

const db = mysql.createConnection({
    host : "mysql-52374-0.cloudclusters.net",
    user : "do3bl",
    database : "dress",
    password: "123456789",
    port: "16397"
});


router.post('/singup',(req,res,next)=>{
const singup = {
password:req.body.password,
email:req.body.email,
username:req.body.username,
phone:req.body.phone
    }
    console.log(singup)
db.query('SELECT * FROM mobile_user WHERE email = ? ',[singup["email"]],(error, rows, fields)=>{
    if(error){
        res.status(400).json({
         massege:"error"
        });
    }
        if(rows.length === 0){
    db.query('insert into mobile_user(user_name, email, password, phone)values(?,?,?,?)',[singup["username"],singup["email"],singup["password"],singup["phone"]],(error,rows)=>{
        console.log(rows['insertId']);
        if(error){
            res.json({error})
        }
        db.query('SELECT * FROM mobile_user WHERE email = ? ',[singup["email"]], (error,result)=>{
            if(error){
                console.log(error);
                res.status(404).json({
                message:error
                })
                
            }else{
                const userid = rows['insertId'];
                console.log(userid)
                db.query(`INSERT INTO clintsize(mubile_user_id, clint_name, clint_phone) VALUES(?, ?, ?)`,[userid,singup["username"],singup["phone"]],(error,rows1)=>{
                    if(error){
                        res.json({error});
                    }
                    res.status(220).json({
                        result
                    });
                })
                
                    }                    
                });
            });
        }else{
            res.status(210).json({
                data:rows,
                message:"exict"
            });
        }
    });

});



router.post('/login',(req, res, next) => {
    const login = {
        password:req.body.password,
        email:req.body.email,
    }
    db.query(`select * from mobile_user where email = ? and password = ?`,
    [login["email"],login["password"]],(error,rows,fields)=>{
        if(error){
            res.json({
                message:"error"
            });
        }
        if(!rows[0]){            
            res.status(210).json({
            message:'not ok'
            });
        }else{
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
            res.status(220).json(result);
        });
        
        
    });
});

router.post('/clintsize',(req,res,next)=>{
    const userid = req.body.userid;
    
    db.query('SELECT * FROM clintsize WHERE mubile_user_id = ?',[userid],(error,row)=>{
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
    db.query('INSERT INTO clintsize (hight, bttn, cholder ,chist_whdth, nick, hand_whdth, lower_part, hand_length, muscle ,mubile_user_id,clint_name, clint_phone) VALUES(?,?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)',
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
        sizes["username"],
        sizes["clint_phone"],
        
    ],(error, rows,fields)=>{
        if(error){
            res.status(220).json({
                message:"not ok",
                error
            });
        }
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
        fabricid:req.body.fabricid,
        dressnum:req.body.dressnum,
        bttn:req.body.bttn,
        hight:req.body.hight
    }
    console.log(order)
    // get dress info
    db.query('SELECT * FROM dress_type WHERE dress_id = ?',[order["dressnum"]],(error,row,fields)=>{
        db.query('SELECT * FROM fabrics WHERE fabric_id = ?',[order["fabricid"]],(error,row,fields)=>{
            // get total price
            var bttn = order["bttn"];
            var hight = order["hight"];
            var taxamount = row[0]["tax_amount"];
            var pricePerm = row[0]["price_per_m"];
            if(bttn <= 30){
                var nededsentemetr = hight*2;
                var nededmetrs = nededsentemetr/100                
                
            }else if(bttn >= 31 && bttn <= 50){
                var nededsentemetr = hight * 2.80;
                var nededmetrs = nededsentemetr/100 
                
            }
            console.log(nededmetrs)
            var forplace = 100;
            var total_price = nededmetrs * pricePerm + taxamount + forplace;
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            
            db.query('SELECT clint_id FROM clintsize WHERE mubile_user_id = ?',[order['userid']],(error,row,fields)=>{
                const clintsizeid = row[0]['clint_id'];
                
                db.query('INSERT INTO clint_order(clint_id , fabricid, mubile_id, mubile, total_price, dress_id, order_time) VALUES(? ,?, ?, ?, ?, ?, ?)',
                [
                    clintsizeid, order['fabricid'], order['userid'], 1, total_price, order['dressnum'], dateTime
                ],
                (error,result,fields)=>{
                    if(error){
                        res.status(404).json({
                            message:"not ok",
                            error:error
                        });
                    }
                    const clint_order = result['insertId'];
                    db.query('INSERT INTO workplace(clintid, fabric_id, date_order, metr_num, dress_id, order_clint)VALUES(?, ?, ?, ?, ?, ? )',
                    [
                        clintsizeid, order['fabricid'], dateTime, nededmetrs, order['dressnum'], clint_order
                    ],(error,result)=>{
                        if(error){
                            res.status(404).json({
                                message:"not ok",
                                error:error
                            });
                        }
                        res.status(572).json({
                            data:result,
                            message:"okk"
                        });
                    })
                    
                });
            });

        });
    });
});


router.post('/status',(req,res,next)=>{
    const userid = req.body.userid;
    db.query(`select clint_orderid, total_price,bayed,is_bayed, 
    order_time from clint_order where mubile_id = ?`,
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
    var date = new Date().toISOString().substring(0,10);
    var myPastDate=new Date(date);
    myPastDate.setDate(myPastDate.getDate() - 10);
    var isost =new Date (myPastDate).toISOString().substring(0,10)

    db.query('SELECT clintsize.clint_id FROM clintsize WHERE clintsize.mubile_user_id = ?',[userid],(error,result)=>{
        if(error){
            res.status(400).json({
                error:error
            });
        }
        const userId = result[0]['clint_id']
        db.query('UPDATE clint_order SET is_bayed = 1 , bayed = ? WHERE clint_orderid = ?',[thebayment,invonum],(error,result)=>{
            if(error){
                res.status(400).json({
                    error:error
                });
            }
            res.status(200).json({
                result:result
            })
        })
    })
    



});


router.post('/dfzf',(req,res,next)=>{
    const invonum = req.body.ordernum;
    const userid = req.body.userid;
    const thebayment = req.body.thebaymnt;
    const imagename = req.body.imagename;
    const imageb1ase = req.body.imagebase;
     
  

// get employee he dont have work for the 10 past days
// first get the employee how work in departmnt 2 
 db.query('SELECT employees.employee_id, employees.employee_name, employees.dept_id FROM employees, departments WHERE departments.department_id = employees.dept_id and dept_id = 2',(error,result)=>{
     if(error){
         console.log("select error:"+error)
         res.status(400).json({
             message:error
         });
     }else{
// get date of current date
         var date = new Date().toISOString().substring(0,10);
// get 10 dayes past 
        var myPastDate=new Date(date);
        myPastDate.setDate(myPastDate.getDate() - 10);
        var isost =new Date (myPastDate).toISOString().substring(0,10)
// for to get eche employee and chek if he have work in the last 10 days
        var emptyEmployee;
         for(var i = 0; i <= result.length - 1; ++i){
                var emplyee = result[i]['employee_id'];
                console.log(emplyee);
                db.query("select * from dress_number where dress_worker_id = ? and date_time_taked BETWEEN ? and ?  ",[emplyee,isost, date],(error,row)=>{
                    if(error){
                        console.log("select:"+error)
                        res.status(400).json({
                            error:error
                        });
                    }
// if employee has 3 work for 10 days dont accept 
                        if(row.length > 3){ 
                            res.status(202).json({
                                message:"more then 3"
                            });
                         }else if(row.length <= 3){
                             emptyEmployee = emplyee;
                             console.log(emptyEmployee);
                         } 
                        
                })
         }
         
         res.status(200).json({
            message:"ok"
        })
     }
 });
 
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
});

router.get('/dresstype',(req,res,next)=>{
    db.query('SELECT * FROM dress_type',(error,result)=>{
        if(error){
            console.log(error);
            res.status(404).json({
                error:error
            });
        }else{
            console.log(result);
            res.status(200).json(
                result
            );
        }
    });
});

router.get('/',(req,res)=>{
    res.json({
        work:"working",
        working:"working2"
    })
})


module.exports = router ;