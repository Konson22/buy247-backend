const express = require('express');
const { adverts } = require('../module/modal');
const { verifyToken } = require('../midleware/jwt');
const upload = require('../midleware/upload');


const route = express.Router()

// GET ALL ITEMS
route.get("/", async (req, res) => {
    try {
        adverts.find({}, (err, result) => {
			if(err) throw err;
			res.json(result)
		})
    } catch (error) {
      res.sendStatus(500)
    }
});

//UPLOAD ITEM   
route.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
    try{
        if(!req.file) return res.status(404).send('Upload Image')
        
        const image =  `/uploads/${req.file.originalname}`
        const adsData = {...req.body, image, sallerId:req.user._id}
        adverts.insert(adsData, (err, result) => {
            if(err) throw err;
            res.json(result)
        })
    }catch(error){
        res.status(500).send('Internal Server Error')
    }
})


module.exports = route