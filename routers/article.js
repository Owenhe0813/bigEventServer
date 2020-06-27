const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { log } = require('console');
const db = require('../db');
const filePath = '/uploads';
const upload = multer({ dest: filePath });
//事件处理函数
const moment = require('moment');
const { title } = require('process');

//编写接口
// router.get('/地址', async(req, res) => {})
// router.post('/地址', async(req, res) => {})




// 发布新文章
router.post('/add', upload.single('cover_img'), async(req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
        //1.数据处理
        // 1.1 结构需要的req.body的数据
        let { title, cate_id, content, state } = req.body;
        // 1.2 赋值给data新增需要的数据，不改变body的值
        const data = {
                title,
                cate_id,
                content,
                state,
                pub_date: moment(new Date()).format('YYYY-MM-DD HH-mm-ss'), //需要处理时间数据
                cover_img: req.file.path,
                author_id: req.user.id
            }
            //2.查询字符串
        const queryStr = 'insert into articles set ?';
        //3.操作数据库
        let backdata = await db(queryStr, data);
        //4.根据状态决定下一步操作
        console.log(backdata);
        //5.返回数据
        if (!backdata.affectedRows) throw new Error('更新失败');
        res.send({
            status: 0,
            message: '发布文章成功！'
        });

    } catch (error) {
        console.log(error);
        //6.错误处理
        res.send({
            status: 1,
            message: '发布文章失败！'
        });
    }
});

// 获取文章的列表数据
router.get('/list', async(req, res) => {
    try {
        //1.处理搜索的索引位置
        const startIndex = (req.query.pagenum - 1) * req.query.pagesize;
        const endIndex = +req.query.pagesize + startIndex;
        console.log(startIndex, endIndex);

        //2.处理查询字符串
        const queryStrArticles = `select Id,title,pub_date,cate_id,state from articles where cate_id${req.query.cate_id?'=?':' is not null'} and state${req.query.state?'=?':' is not null'} order by Id limit ?,?`;
        const queryStrTotal = 'select count(*) as total from articles';
        //处理arr配合查询字符串里有？的项目
        let queryArr = [req.query.cate_id, req.query.state, startIndex, endIndex].filter(item => {
            return item || item === 0;
        });
        console.log(queryArr);

        // queryArr = queryArr
        //3.搜索
        let backdataArticles = db(queryStrArticles, queryArr); //数据
        let backdataTotal = db(queryStrTotal); //总数
        backdataArticles = await backdataArticles;
        backdataTotal = await backdataTotal;
        //3.1处理cate-id和cate_name的对应关系，采用promiseall的方式
        const cateNameArr = []; //promise
        backdataArticles.forEach(item => {
            // 根据item.cate_id来进行判断
            const queryStr = 'select name from categories where Id =?'
            cateNameArr.push(db(queryStr, item.cate_id));
        });
        let cateName = await Promise.all(cateNameArr); //最终的cateName数据

        //处理响应数据的catename选项以及cate_id
        backdataArticles.forEach((item, index) => {
            item.cate_name = cateName[index][0].name;
            delete item.cate_id;
        });
        //4.错误处理
        //5.数据处理
        //6.响应
        res.send({
            "status": 0,
            "message": "获取文章列表成功！",
            "data": backdataArticles,
            "total": backdataTotal[0].total
        });
    } catch (error) {
        //7.响应
        console.log(error);
        res.send({
            "status": 0,
            "message": "获取文章列表失败！"
        });

    }
});

// 根据 Id 删除文章数据
router.get('/delete/:id', async(req, res) => {
    try {
        //查询字符串:自己只能刷新自己的文章
        const querySelector = 'delete from articles where id =? and author_id=?';
        const id = req.params.id;
        const author_id = req.user.id;
        //删除文章
        let backdata = await db(querySelector, [id, author_id]);
        //错误处理
        if (!backdata.affectedRows) throw new Error('未找到这条文章，请刷新界面');
        //返回响应
        res.send({
            "status": 0,
            "message": "删除成功！"
        });
    } catch (error) {
        console.log(error);
        res.send({
            "status": 1,
            "message": "删除失败！"
        });
    }
});

// 根据 Id 获取文章详情
router.get('/:id', async(req, res) => {
    try {
        //查询字符串
        const querySelector = 'select * from articles where Id = ?';
        // 查询
        let backdata = await db(querySelector, req.user.id);
        // 错误判断
        console.log(backdata);

        if (!backdata.length) throw new Error('未找到相关条目，请重新刷新页面');

        console.log(backdata);
        // 发送响应
        res.send({
            "status": 0,
            "message": "获取文章成功！",
            "data": backdata[0]
        });
    } catch (error) {
        // 发送响应
        console.log(error);
        res.send({
            "status": 1,
            "message": "获取文章成功！",
        });
    }
});

// 根据 Id 更新文章信息
router.post('/edit', upload.single('cover_img'), async(req, res) => {
    try {
        //1.获取文章数据
        //2.数据处理
        const { title, cate_id, content, state, Id } = req.body;
        console.log(req.file);
        console.log(req.body);
        const cover_img = req.file && req.file.path;
        const pub_date = moment(new Date()).format('YYYY-MM-DD HH-mm-ss');
        const author_id = req.user.id;
        //3.查询字符串
        const queryStr = 'update articles set ? where Id=?';
        //4.更新页面
        let backdata = await db(queryStr, [{
            title,
            cate_id,
            content,
            state,
            pub_date,
            author_id,
            cover_img
        }, Id]);
        //5.错误处理
        console.log(backdata);
        if (!backdata.affectedRows) throw new Error('未找到相关条目，请刷新页面');

        //6.发送响应
        res.send({
            status: 0,
            message: '修改文章成功！'
        })
    } catch (error) {
        console.log(error);

        // 7.发送错误响应
        res.send({
            status: 1,
            message: '修改文章失败！'
        })

    }
});






module.exports = router;