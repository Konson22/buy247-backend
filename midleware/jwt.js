const {verify, sign} = require('jsonwebtoken')

async function createToken(user){
    return await sign(user, 'secreteword')
}


async function verifyToken(req, res, next) {
	
	const token = req.cookies['SALE-CONEX-KEY']
	try{
        if(!token){
			res.status(200).json({
				status:false,
				message:'You do not have valid token'
			});
			return
		} 
       
		verify(token, 'secreteword', (err, user)=>{
			if(err) return res.status(200).json({
				status:false,
				message:'You do not have valid token'
			});
			req.user = user
			return next();
		});

	}catch(err){
		return res.status(500).send('Internal Server Error');
	}
}

module.exports = {createToken, verifyToken}