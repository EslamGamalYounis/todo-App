//split code and route   --- using routers done
//error handler          ---  
//duplicate in route     ----- done
//validation
//authentication && authorization

const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
require('./db-connection');
const userRouter =require('./routers/userRouter');
const todoRouter =require('./routers/todoRouter');
const authenticationMiddleware = require('./middlewares/authentication');
const port = 4000;

app.use('/users',userRouter);
app.use('/todos',authenticationMiddleware,todoRouter);







app.listen(port,()=>{
    console.info('server listen in port '+port);
})