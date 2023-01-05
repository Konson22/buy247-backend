const express = require('express');
const bcrypt = require('bcryptjs');
const { createToken, verifyToken } = require('../midleware/jwt');
const {User, Clients} = require("./../models/models");


const route = express.Router()

route.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
});

// GET ALL CLIENTS
route.get("/clients", async (req, res) => {
    try {
        const clients = await Clients.find({});
        res.json(clients);
    } catch (error) {
      res.status(500).send(error);
    }
});

//AUTHORIZE TOKEN
route.post('/verify-token', verifyToken, (req, res) => {
    res.status(200).json({
        status:true,
        message:'You do not have valid token',
        profile:req.user,
        notifications:[]
    })
})

// LOGIN USER
route.post('/login', async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.find({email:email});
        if(user.length == 0) return res.status(403).send(`Not Registered`)
        const verify = await bcrypt.compare(password, user[0].password)
        if(!verify) return res.status(403).send('Wrong password!');
        const token = await createToken({name:user[0].name, email:user[0].email, avatar:user[0].avatar, _id:user[0]._id})
    
        res.cookie('SALE-CONEX-KEY', token, {maxAge:10000 * 60 * 60, httpOnly:true, SameSite:'none', secure:true})
        res.status(200).json({
            status:true,
            profile:{
                name:user[0].name, 
                email:user[0].email, 
                avatar:user[0].avatar, 
                _id:user[0]._id
            },
            notifications:[]
        })
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
})

//REGISTER NEW USER
route.post('/register', async (req, res) => {
    try{
        const hashPass = await bcrypt.hash(req.body.password, 5);
        const userData = {
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            password:hashPass,
            followers:[],
            following:[],
            setting:[{
                showMyName:false,
                showAbout:false,
            }],
            avatar:'/images/user.png'
        }

        const user = new User(userData);
      
        await user.save();
        const authUser = {
            name:user.name, 
            email:user.email, 
            phone:user.phone, 
            avatar:user.avatar, 
            _id:user._id
        }
        const token = await createToken(authUser)
        res.cookie('SALE-CONEX-KEY', token, {maxAge:10000 * 60 * 60, httpOnly:true, SameSite:'none', secure:true})
        res.json({
            status:true,
            profile:authUser,
            notifications:[]
        })
        
    }catch(error){
        res.status(500).send('error');
    }
})


module.exports = route