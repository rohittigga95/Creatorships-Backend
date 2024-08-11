const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    name: {
        type: String,     
    },
    userType: {
        type: String,
    },
    place: {
        type: String,
    },
    link: {
        type: String,
    },
    img: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});


module.exports = mongoose.model("Data", dataSchema);