const express = require('express');
const router = express.Router();
const utility = require('utility');
const db = require('../db');
const jwt = require('jsonwebtoken');
jwt.sign

//编写接口
// router.get('/地址', async(req, res) => {});
// router.post('/地址', async(req, res) => {})

router.post('/reguser', async(req, res) => {
    try {
        const data = req.body;
        data.password = utility.md5(data.password);
        const queryStr = 'insert into user set ?';
        let back = await db(queryStr, data);
        res.send({
            status: 0,
            message: '注册成功'
        });
    } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
        res.send({
            status: 1,
            message: '注册失败'
        })
    }
});
//登录。。。。。。。。。。。。。。。。。。。。
router.post('/login', async(req, res) => {
    try {
        const data = req.body;
        data.password = utility.md5(data.password);
        //查询语句
        const queryStr = 'select * from user where username = ? and password = ?';
        let backData = await db(queryStr, [data.username, data.password]);
        if (!backData.length) throw new Error('用户名或密码错误');
        let token = 'Bearer ' + jwt.sign({
                id: backData[0].id
            },
            'hyz', {
                expiresIn: '7 days'
            })
        res.send({
            status: 0,
            message: '登录成功',
            token
        })
    } catch (error) {
        console.log(error);
        res.send({
            status: 0,
            message: '用户名或密码错误'
        });
    }

});












module.exports = router;