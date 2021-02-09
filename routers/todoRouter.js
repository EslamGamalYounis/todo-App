
const express =require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const Todo =require('../models/Todo');
//base path is /todos
const handleError = function(err) {
    console.error(err);
    return;    
};

const todoRouter =new express.Router();



todoRouter.post('/',(req,res,next)=>{
    const {userId,title,body,tags,createdAt,updatedAt}=req.body;
    Todo.create({userId:userId,title:title,body:body,tags:tags,createdAt:createdAt,updatedAt:updatedAt},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`you enter wrong value`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send({message:'todo was created '})
    })
})


todoRouter.get('/:userId',(req,res,next)=>{
    const {userId} =req.params;
    const userObjectId = mongoose.Types.ObjectId(userId);
    
    Todo.find({userId:userObjectId},(err,todos)=>{
        if(err){
            res.statusCode = 401;
            res.send({error:`invalid path`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send({message :'todos returned successfully',todos});
        next();
    })
});

todoRouter.get('/',(req,res,next)=>{
    const {limit,skip}=req.body;
    Todo.find({},null,{limit:limit,skip:skip},(err,todos)=>{
        if(err){
            res.statusCode = 401;
            res.send({error:`invalid path`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send({message:'todos returned successfully',todos});
        next();
    })
});


todoRouter.patch('/:id',(req,res,next)=>{
    var {id} = req.params;
    const {title,body,tags}=req.body;
    Todo.updateOne({_id:id},{title: title,body: body,updatedAt:Date.now(),tags:tags},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`invalid id not found in database`})
            return handleError(err);
        }
        console.log('')
        res.statusCode=200;
        res.send('todo is updated successfully');
        next();
    })
})


todoRouter.delete('/:id',(req,res,next)=>{
    var {id} = req.params;
    Todo.deleteOne({_id:id},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`invalid id not found in database`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send('todo delete successfully');
        next();
    })
})

module.exports =todoRouter;