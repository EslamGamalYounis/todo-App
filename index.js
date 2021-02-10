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
const PORT = process.env.PORT || 3000;

app.use('/users',userRouter);
app.use('/todos',todoRouter);


app.listen(PORT,()=>{
    console.info('server listen in port '+PORT);
})