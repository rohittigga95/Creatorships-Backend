const User = require("../Models/UserModel");
const Creator = require("../Models/CreatorModel");
const Business = require("../Models/BusinessModel");
const Contact = require('../Models/ContactModel');
const Data = require('../Models/DataModel');
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");
const { userVerification, adminVerification } = require("../Middlewares/AuthMiddleware");
const axios = require('axios');


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
    const { name, place, link, userType, img, createdAt } = req.body;
    try {
        const data = await Data.create({ name, place, link, img, userType, createdAt });
        res.status(201).json({ message: "Customer Added", success: true, data })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.GetData = async (req, res) => {
    try {
        if (() => adminVerification()) {
            const data = await Data.find();
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports.seamlessapi = async (req, res) => {
    let data = JSON.stringify({
        "companySearchId": null,
        "limit": 50,
        "offset": 0,
        "page": 0,
        "type": "all",
        "industries": [],
        "industrySicCodes": [],
        "industryNaicsCodes": [],
        "employeeSizes": [
            "11 - 50"
        ],
        "estimatedRevenues": [],
        "locations": [
            "India"
        ],
        "locationRadius": [],
        "zipCodes": [],
        "zipCodesRadius": [],
        "technologies": [],
        "companies": [],
        "companiesExactMatch": false,
        "companyKeywords": [
            "startup"
        ],
        "keywordsIsOr": false
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.seamless.ai/api/companies/search',
        headers: {
            'Content-Type': 'application/json',
            'Seamlessai-Client': 'eyJhcHAiOiJjbGllbnQiLCJ2ZXJzaW9uIjoidjEzLjEyLjc4In0',
            'Cookie': 'gauid=fwtdylb3qausyH; _fbp=fb.1.1723358038251.795001755638901978; _lfa=LF1.1.ae2d0cd5a2653fa3.1723358038948; ajs_anonymous_id=0bec5a34-5570-40b8-81cf-9e7af49fc5eb; OptanonAlertBoxClosed=2024-08-11T06:36:49.528Z; _gcl_au=1.1.422186106.1723358210; _gid=GA1.2.1652340087.1723358210; gacid=1322220635.1723358029; __stripe_mid=5a44daaa-ca8f-419b-9169-91dc6313acbec0589f; api-key=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InJvaGl0dGlnZ2FAY3JlYXRvcnNoaXBzLmNvbSIsImZpcnN0bmFtZSI6IlJvaGl0IiwibGFzdG5hbWUiOiJUaWdnYSIsImNvbXBhbnkiOiJjcmVhdG9yc2hpcHMiLCJyb2xlIjoidXNlciIsInNlc3Npb25JZCI6MjM4NzQ1Niwic2Vzc2lvblNlc3Npb25JZCI6IjAwWEkwakd4UlhXbkxZZDY2WGh3Z3RGQXQyWERNaU5BZjhPckNxUWoiLCJnYVVzZXJJZCI6ImZ3dGR5bGIzcWF1c3lIIn0.GKQKslD-9PSonhUTgWqzf4yoM9cuU8LYddsmiJWvX8U; signed-in=true; device-id=f097f61a9955b5e9fe63f1c10437a0d0; ajs_user_id=3103522; __stripe_sid=877b0e08-d856-4fdd-9353-87a905f9b584c99159; _ga_BV6762G78H=GS1.1.1723388193.3.0.1723388199.0.0.0; _ga_87XQ8EJ1HJ=GS1.1.1723388196.2.0.1723388199.57.0.0; _rdt_uuid=1723358030973.6c07ce5e-28ce-42ea-844f-bd37a3f02174; _ga=GA1.2.1322220635.1723358029; fs_lua=1.1723388203381; fs_uid=#o-1KME8Z-na1#e4b4597b-d00f-442b-b1a1-be800dfbcd4a:00f8533c-12de-4587-a3d6-65581db7cc94:1723388196956::2#e891bb37#/1754894062; _uetsid=ae39a2c057ab11efaf0801d30865ed81; _uetvid=ae3a06e057ab11ef90df51ce3d34a65f; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Aug+11+2024+20%3A26%3A44+GMT%2B0530+(India+Standard+Time)&version=202404.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=aad77143-960c-467d-a1da-9b45839a290a&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&intType=1&geolocation=IN%3BBR&AwaitingReconsent=false; analytics_session_id=1723388205593; analytics_session_id.last_access=1723388215065'
        },
        data: data
    };
    try {

        axios.request(config)
            .then((response) => {
                res.json(response.data);
            })
        

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
