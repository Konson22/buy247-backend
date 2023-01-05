const express = require('express');
const upload = require('../midleware/upload');
const { verifyToken } = require('../midleware/jwt');
const {Items} = require("../models/models");



const route = express.Router()

route.get("/", async (req, res) => {
    try {
        const items = await Items.find({});
        res.status(200).json(items);
    } catch (error) {
      res.status(500).send('error occure');
    }
});


route.get("/add", async (req, res) => {
    try {
        const item = new Items({
            title:`Opna Women's Short Sleeve`,
            description:'100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort.',
            price:'9.9',
            category:'fashion',
            currency:'SSP',
            image:'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg',
            seller:{
                name:'Alison John Bol',
                phone:'+211925979070',
                email:'alisonjohn@gmail.com',
                sallerId:2
            }
        });
        await item.save();
        res.status(200).json(item);
    } catch (error) {
      res.status(500).send(error);
    }
});


//UPLOAD ITEM   
route.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
    if(!req.file) return res.status(404).send('Upload Image')
    try{
        const image =  `/uploads/${req.image}`
        const adsData = {...req.body, image, sallerId:req.user._id}
        const item = new Items(adsData);
        await item.save();
        res.status(200).json(item);
        
    }catch(error){
        res.status(500).send(error);
    }
})


module.exports = route