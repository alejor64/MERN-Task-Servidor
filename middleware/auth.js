const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    //Read jwt header
    const token = req.header('x-auth-token')
    
    //Check token
    if(!token){
        res.status(401).json({msg: 'There is not JWT, invalid permison'})
    }

    //Validate Token
    try{
        const cifrated = jwt.verify(token, process.env.SECRET)
        req.user = cifrated.user
        next()
    } catch(err){
        res.status(401).json({msg: 'Invalid Token'})
    }
}