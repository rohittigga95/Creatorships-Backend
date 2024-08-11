const User = require("../Models/UserModel");
const Creator = require("../Models/CreatorModel");
const Business = require("../Models/BusinessModel");
const Contact = require('../Models/ContactModel');
const Data = require('../Models/DataModel');
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");
const { userVerification, adminVerification } = require("../Middlewares/AuthMiddleware");

module.exports.Signup = async (req, res, next) => {
    try {
        const { email, password, userType, createdAt } = req.body;
        if (!email || !password || !userType) {
            return res.json({ message: "all fields are required" })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        const user = await User.create({ email, password, userType, createdAt });
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user });
        next();
    } catch (error) {
        console.error(error)
    }
}

module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: "all fields are required" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "User not found. Please signup" })
        }
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({ message: "Incorrect password or email" })
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false
        });
        res.status(201).json({ message: "User logged in successfully", success: true });
        next();
    } catch (error) {
        console.error(error);
    }
}

module.exports.AdminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: "all fields are required" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "Not admin." })
        } else if (user.userType === 'admin') {
            const auth = await bcrypt.compare(password, user.password)
            if (!auth) {
                return res.json({ message: "Incorrect password or email" })
            }
            const token = createSecretToken(user._id);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false
            });
            res.status(201).json({ message: "admin logged in successfully", success: true });
            next();
        }
        else res.json({ message: "sorryy you are not admin" })

    } catch (error) {
        console.error(error);
    }
}

module.exports.GetCreators = async (req, res) => {
    try {
        
        
        if (() => adminVerification()) {
            const creators = await Creator.find();
            res.json(creators);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.GetContacts = async (req, res) => {
    try {
        
        
        if (() => adminVerification()) {
            const contacts = await Contact.find();
            res.json(contacts);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.GetBusinesses = async (req, res) => {
    try {
        if (() => adminVerification()) {
            const businesses = await Business.find();
            res.json(businesses);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.PostCreators = async (req, res) => {
    const { name, email, link, createdAt } = req.body;
    // const creator = new Creator({ name, email, link });
    try {

        const creator = await Creator.create({ name, email, link, createdAt });
        res.status(201).json({ message: "Creator signed in successfully", success: true, creator });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.Postbusinesses = async (req, res) => {
    const { name, email, link, createdAt } = req.body;
    try {
        const business = await Business.create({ name, email, link, createdAt });
        res.status(201).json({ message: "Business signed in successfully", success: true, business });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.Contact = async (req, res) => {
    const { fname, lname, email, phone, msg, createdAt } = req.body;
    try {
        const contact = await Contact.create({ fname, lname, email, phone, msg, createdAt });
        res.status(201).json({ message: "Thankyou for contacting us", success: true, contact })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.AddData = async (req, res) => {
    const { name, place, link,userType, img, createdAt } = req.body;
    try {
        const data = await Data.create({ name, place, link, img, userType, createdAt });
        res.status(201).json({ message: "Customer Added", success: true, data })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.GetData = async (req,res) => {
    try {
        if (() => adminVerification()) {
            const data = await Data.find();
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}