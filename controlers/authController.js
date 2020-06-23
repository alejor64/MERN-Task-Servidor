const User = require('../models/User')
const  bcryptjs =require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')


exports.authUser = async (req, res) => {
    //Check errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //Extrac email & password
    const {email, password} = req.body

    try{
        //Check user registred
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({msg: 'User does not exist'})
        }

        //Check password
        let passwordEmail = await bcryptjs.compare(password, user.password)
        if(!passwordEmail){
            return res.status(400).json({msg: 'Password invalid'})
        }

        // Create JWT
        const payload = {
            user: {
                id: user.id
            }
        }

        //sign JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (err, token) => {
            if(err) throw err

            //Msn confirmed
            res.json({token})
        })
        
    } catch(err){
        console.log(err)
    }
}


//Get user Authenticated
exports.userAuthenticated = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json({user})
    } catch(err){
        console.log(err)
        res.status(500).json({msg: 'An error ocurred'})
    }
}