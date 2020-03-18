let express = require('express')
    router = express.Router(),
    methods = require('../utils/functions');

router.get('/balanceOf/:address', async function (req, res) {
    let result = await methods.getBalanceOf(req.params.address);
    res.send(result);
});

router.post('/transfer',async function (req, res) {
    let _to = req.body.to;
    let _amount = req.body.amount;
    let result = await methods.transfer(_to, _amount);
    res.send(result);
});

router.post('/approve',async function (req, res) {
    let _spender = req.body.spender;
    let _amount = req.body.amount;
    let result = await methods.approve(_spender, _amount);
    res.send(result);

});

router.get('/allowance/:address',async function (req, res) {
    let _spenderAddress = req.params.address 
    let result = await methods.allowance(_spenderAddress);
    res.send(result);
});

router.post('/transferFrom',async function (req, res) {
    let fpk = req.body.fpk; 
    let _add = req.body.address; 
    let f_add = req.body.f_address;
    let _amount = req.body.amount;
    let result = await methods.transferFrom(f_add,_add,_amount, fpk);
    res.send(result);
});



module.exports = router;
