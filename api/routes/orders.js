const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.status(200).json({
        message: 'orders were fetched'
    });
});

router.post('/',(req, res, next) => {
    const order = {
        prodectId: req.body.prodectId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'orders were fetched',
        order: order
    });
});

router.get('/:ordrid',(req, res, next) => {
    res.status(200).json({
        message: 'orders detail',
        orderid: req.params.ordrid
    });
});

router.delete('/:ordrid',(req, res, next) => {
    res.status(200).json({
        message: 'orders deleted',
        orderid: req.params.ordrid
    });
});

module.exports = router ;