const User = require('../models/User')
const  bcryptjs =require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {

    //Check errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body

    try{
        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({msg: 'User already exist'})
        }

        //Create user
        user = new User(req.body)

        //Hashing password
        const salt = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(password, salt)

        //Save user
        await user.save()

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
        res.status(400).send('An error ocurred')
    }
}