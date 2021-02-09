const express =require('express');
var bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const mongoose = require('mongoose');

const jwt =require('jsonwebtoken');

const User =require('../models/User');
const Todo =require('../models/Todo');
const authenticationMiddleware = require('../middlewares/authentication');

//base path is /users
const userRouter =new express.Router();

const handleError = function(err) {
    console.error(err);
    throw new Error(err.message);
    return;    
};

userRouter.post('/register',async (req,res,next)=>{
    try{
        const {username,password,firstname,age}=req.body;
        const hash = await bcrypt.hash(password,7);
        const user = await User.create({username:username,password:hash,firstname:firstname,age:age});
        res.statusCode=200;
        res.send({message:'user was registered successfully'}) ;
        next();
    }
    catch(err){
        res.statusCode = 422;
        res.send(err);
        return handleError(err);
    }
});



userRouter.post('/login', async (req,res,next)=>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username:username}).exec(); //vulnerability
        if(!user){
            throw new Error("wrong username or password");
        }
        //console.log(user);
        const isMatch = await bcrypt.compare(password,user.password);
        if(! isMatch){
            throw new Error("wrong username or password");
        }
        // generate token and send  to user
        const token =jwt.sign({id:user.id},'my-signing-secret')

        const {id,firstname}=user;
        // to get last todo 
        const objectId = mongoose.Types.ObjectId(id);
        const userTodos = await Todo.find({userId:objectId}).exec()
        if(!userTodos) throw new error('can not get user Todos')

        res.statusCode=200;
        res.send({token:token,message: "logged in successfully welcome",firstname ,userTodos } ) ;
        next();
    }
    catch(err){
        res.statusCode = 422;
        res.json({success:'false' ,message:err.message});
        return handleError(err);
    }
});

userRouter.get('/',(req,res,next)=>{
    User.find({},{username:0,_id:0,password:0,age:0,__v:0},(err,users)=>{
        if(err){
            res.statusCode = 401;
            res.send({message:`invalid path`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send(users);
        next();
    })
});

//userRouter.use(authenticationMiddleware);
// (req,res,next)=>{
//     try{
//         const {authorization} =req.headers;
//         const signedData=jwt.verify(authorization,'my-signing-secret')
//         req.signedData = signedData;
//         next();
//     }
//     catch(err){
//         res.statusCode = 401;
//         res.send({success:false, message:`Authentcation failed`})
//         return handleError(err);
//     }

userRouter.get('/profile',async (req,res,next)=>{
    try{
        const {authorization} =req.headers;
        const signedData=jwt.verify(authorization,'my-signing-secret')
        //req.signedData = signedData;
        const user =await User.findOne({_id:signedData.id},{password:0,__v:0})
        res.statusCode=200;
        res.send(user);
        next();
    }    

    catch(err){
        //authorize error 401
        res.statusCode = 401;
        res.send({success:false, message:`Authentcation failed`})
        return handleError(err);
    }
});


userRouter.delete('/:id',(req,res,next)=>{
    var {id} = req.params;
    User.deleteOne({_id:id},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`invalid id not found in database`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send('user delete successfully');
        next();
    })
})

userRouter.patch('/:id',(req,res,next)=>{
    var {id} = req.params;
    const {username,firstName,password,age}=req.body;
    User.updateOne({_id:id},{username:username,firstname:firstname,password:password,age:age},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`invalid id not found in database`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send('user is updated successfully');
        next();
    })
})

module.exports =userRouter;