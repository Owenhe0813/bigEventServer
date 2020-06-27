const express = require('express');
const router = express.Router();
const db = require('../db');
const utility = require('utility');


//编写接口
// router.get('/地址', async(req, res) => {})
// router.post('/地址', async(req, res) => {})

//获取用户基本信息
router.get('/userinfo', async(req, res) => {
    try {
        //获取id
        // if (!req.user.id) res.send({//在中间件错误处理函数内部实现功能
        //     status: 1,
        //     message: '身份认证失败！'
        // });
        const queryString = 'select * from user where id = ?';
        //根据id获取用户信息
        let [data] = await db(queryString, req.user.id);
        // 将数据发送给用户
        delete data.password;
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data
        });
    } catch (error) {
        res.send({
            status: 1,
            message: '获取用户基本信息失败！'
        });
    }
});

// 更新用户基本信息。。。。。。。。。。。。
router.post('/userinfo', async(req, res) => {
    try {
        // 两个id是否有问题呢？？？？？？
        //查询字符串
        const queryStr = 'update user set nickname = ?,email = ? where id=?';
        //跟新用户信息
        let data = await db(queryStr, [req.body.nickname, req.body.email, req.body.id]);
        //没有查到这个数据
        if (!data.affectedRows) throw new Error('没有该用户的信息');
        // 返回对象
        res.send({
            status: 0,
            message: '修改用户信息成功！'
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: 1,
            message: '修改用户信息失败！'
        });
    }
});

// 重置密码。。。。。。。。。。。。。。。。
router.post('/updatepwd', async(req, res) => {
    try {
        // 获取新密码并加密
        const newPwd = utility.md5(req.body.newPwd);
        const oldPsw = utility.md5(req.body.oldPwd);
        // 判断原密码是否正确
        const queryStr = 'update user set password = ? where id = ? and password = ?';
        //更新新密码
        let backdata = await db(queryStr, [newPwd, req.user.id, oldPsw]);
        console.log(backdata);

        // 根据返回值判断
        if (!backdata.affectedRows) throw new Error('原密码错误');
        //返回状态
        res.send({
            "status": 0,
            "message": "更新密码成功！"
        });
    } catch (error) {
        console.log(error);
        if (error.message === '原密码错误') {
            res.send({
                "status": 1,
                "message": "原密码错误"
            });
        } else {
            res.send({
                "status": 1,
                "message": "更新密码失败"
            });
        }


    }
});

// 跟换头像。。。。。。。。。。。。。。。。
router.post('/update/avatar', async(req, res) => {
    try {
        try {
            //查询字符串
            const queryStr = 'update user set user_pic =? where id=?';
            //跟新用户信息
            let data = await db(queryStr, [req.body.avatar, req.user.id]);
            //没有查到这个数据
            if (!data.affectedRows) throw new Error('没有该用户的信息');
            // 返回对象
            res.send({
                status: 0,
                message: '更新头像成功！'
            });
        } catch (error) {
            console.log(error);
            res.send({
                status: 1,
                message: '更新头像失败！'
            });
        }
    } catch (error) {

    }
});










module.exports = router;