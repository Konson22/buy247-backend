const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, 'public/uploads')
    },
    filename:function(req, file, cb){
        const exten = file.originalname.split('.')[1]
        const fileName = `${Date.now()}.${exten}`
        req.image = fileName
        cb(null, fileName)
    }
})

const upload = multer({storage:storage});

module.exports = upload