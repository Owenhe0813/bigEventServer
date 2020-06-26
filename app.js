const express = require('express');
const app = express();
const cors = require('cors');

//加载路由
const userRouter = require('./routers/user');
const articleRouter = require('./routers/article');
const loginRouter = require('./routers/login');
const categoriesRouter = require('./routers/categories');



// 跨域
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// });
app.use(cors());

// 编码
app.use(express.urlencoded({ extended: false }));

//注册路由

app.use('/my/article', categoriesRouter);
app.use('/api', loginRouter);
app.use('/my', userRouter);
app.use('/my/article', articleRouter);


app.listen(3000, (err) => {
    if (err) return;
    console.log('成功开启服务器。。。。。。。');

});