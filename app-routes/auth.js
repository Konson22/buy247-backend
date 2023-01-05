const express = require('express');
const bcrypt = require('bcryptjs');
const { createToken, verifyToken } = require('../midleware/jwt');
const { users, clients } = require('../module/modal');


const route = express.Router()


// GET ALL CLIENTS
route.get("/clients", async (req, res) => {
    try {
        clients.find({}, (err, result) => {
            if(err) throw err
            res.json(result);
        });
    } catch (error) {
      res.status(500).send('Server Error');
    }
});


// GET ALL USERS
route.get("/", async (req, res) => {
    try {
        users.find({}, (err, result) => {
            if(err) throw err
            res.json(result);
        });
    } catch (error) {
      res.status(500).send('Server Error');
    }
});

// VERIFY TOKEN
route.post('/verify-token', verifyToken, (req, res) => {
    res.json(req.user)
})

//GET DEVELOPEMENT LOGIN
route.post('/login', async (req, res) => {
    const {email, password} = req.body
    try {
        users.find({email:email}, async (err, user) => {
            if(err) res.status(500).send('not registered');
            if(user.length == 0) return res.status(404)
            const verify = await bcrypt.compare(password, user[0].password)
            if(!verify) return res.status(403).send('wrong password')
            const token = await createToken({name:user[0].name, email:user[0].email, phone:user[0].phone, avatar:user[0].avatar, _id:user[0]._id})
        
            res.cookie('SALE-CONEX-KEY', token, {maxAge:10000 * 60 * 60, httpOnly:true, SameSite:'none', secure:true})
            res.json({
                name:user[0].name, email:user[0].email, phone:user[0].phone, avatar:user[0].avatar, _id:user[0]._id
            })
        })
    } catch (error) {
      res.status(500).send('Server Error');
    }
})


// REGISTER NEW USER
route.post('/register', async (req, res) => {
    try{
        if(req.body.name && req.body.phone && req.body.email && req.body.password ){
            const hashPass = await bcrypt.hash(req.body.password, 5);
            const newUser = {
                name:req.body.name,
                phone:req.body.phone,
                email:req.body.email,
                password:hashPass,
                following:[],
                followers:[],
                wishList:[],
                setting:[{
                    showMyName:false,
                    showAbout:false,
                }],
                avatar:'/images/user.png'
            }
            users.find({email:req.body.email}, async (err, results) => {
                if(err) throw err
                if(results.length > 0) return res.status(403).send('Already  registered!.')
                users.insert(newUser, async (err, user) => {
                    if(err) throw err
                    const token = await createToken({name:user.name, email:user.email, phone:user.phone, avatar:user.avatar, _id:user._id})
                    res.cookie('SALE-CONEX-KEY', token, {maxAge:10000 * 60 * 60, httpOnly:true, SameSite:'none', secure:true})
                    res.json({
                        name:user.name, 
                        email:user.email, 
                        phone:user.phone, 
                        avatar:user.avatar, 
                        _id:user._id
                    })
                })
            })
        }else{
            res.status(403).send('Please Fill All fields')
        }
    }catch(error){
        res.status(500).send('Internal Server Error')
    }
})


module.exports = route

