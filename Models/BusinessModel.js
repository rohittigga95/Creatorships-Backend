const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Your name is required"],
        
    },
    email: {
        type: String,
        required: [true, "Your email is required"],
        unique: true,
    },
    link: {
        type: String,
        required: [true, "Your link is required"],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});


module.exports = mongoose.model("Business", businessSchema);