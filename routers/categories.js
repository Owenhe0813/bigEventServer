const express = require('express');
const db = require('../db');
const router = express.Router();

//编写接口

// router.get('/地址', async(req, res) => {});
// router.post('/地址', async(req, res) => {})


// 获取文章分类列表
router.get('/cates', async(req, res) => {
    try {
        //查询字符串
        const querySelector = 'select * from categories';
        //查询所有分类
        let backdata = await db(querySelector);
        console.log(backdata);
        //如果有分类，将分类发送给用户
        res.send({
            status: 0,
            message: "获取文章分类列表成功！",
            data: backdata
        })

    } catch (error) {
        //故障处理
        res.send({
            status: 1,
            message: "获取文章分类列表失败！"
        })

    }
});

// 新增文章分类
router.post('/addcates', async(req, res) => {

    try {
        // 查询字符传:
        const queryStr = 'insert into categories set ?';
        // 处理数据
        // 查询数据
        let backdata = await db(queryStr, req.body);
        console.log(backdata);
        if (!backdata.affectedRows) throw new Error('更新失败');
        // 发送数据
        res.send({
            "status": 0,
            "message": "新增文章分类成功！"
        });
    } catch (error) {
        console.log(error);

        // 故障处理
        res.send({
            "status": 1,
            "message": "新增文章分类失败！"
        });

    }

});

// 根据 Id 删除文章分类
router.get('/deletecate/:id', async(req, res) => {
    const id = req.params.id;
    console.log(id);
    const errorMsg = '数据错误，该条数据不存在'

    try {
        //查询字符串
        const queryStr = 'delete from categories where id = ?';
        //删除文本
        let backdata = await db(queryStr, id);

        if (!backdata.affectedRows) throw new Error(errorMsg);
        console.log(backdata);

        //发送响应
        res.send({
            status: 0,
            message: '删除成功！'
        })
    } catch (error) {
        //故障处理
        console.log(error);
        if (error.message === errorMsg) {
            //没有这一条数据
            res.send({
                status: 1,
                message: errorMsg
            })
        }
        // 其他原因的失败
        res.send({
            status: 1,
            message: '删除失败'
        })

    }
});

// 根据 Id 获取文章分类数据
router.get('/cates/:id', async(req, res) => {
    const errmessage = '没有该条数据，请重新刷新页面';
    try {
        const id = req.params.id;
        //1.查询字符串
        const queryStr = 'select * from categories where id = ?';
        //2.获取数据
        let backdata = await db(queryStr, id);
        console.log(backdata);
        //3.根据获取的数据判断是否得到相关数据
        if (!backdata.length) throw new Error(errmessage);
        //4.发送响应
        res.send({
            status: 0,
            message: "获取文章成功！",
            data: backdata[0]
        });
    } catch (error) {
        // 错误处理
        if (error.message === errmessage) {
            res.send({
                status: 1,
                message: errmessage
            });
        }
        res.send({
            status: 1,
            message: "获取文章失败！"
        });

    }
});

// 根据 Id 更新文章分类数据
router.post('/updatecate', async(req, res) => {
    const errStr = '没有该条分类，请重新选择';
    try {
        //查询字符串
        const queryStr = 'update  categories set name=?,alias=? where id =?';
        //查找相关分类
        const backdata = await db(queryStr, [req.body.name, req.body.alias, req.body.Id]);
        if (!backdata.affectedRows) throw new Error(errStr);
        res.send({
            status: 0,
            message: '更新分类信息成功！'
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: 1,
            message: '更新分类信息失败！'
        });
    }
});









module.exports = router;