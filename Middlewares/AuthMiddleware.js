const User = require("../Models/UserModel");

require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.json({ status: false })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if(err) {
            return res.json({status: false})
        } else {
            const user = await User.findById(data.id)
            if(user.userType === 'creator' || 'business') return res.json({status: true, user: user.userType})
            else return res.json({status: false})
        }
    })
}

module.exports.adminVerification = (req, res) => {
    const token = req.cookies.token
    if(!token) {
        return res.json({ status: false })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if(err) {
            return res.json({status: false})
        } else {
            const user = await User.findById(data.id)
            if(user.userType === 'admin') return res.json({status: true, user: user.userType})
            else return res.json({status: false})
        }
    })
}