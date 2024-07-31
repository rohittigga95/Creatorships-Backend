const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "name requried"],
    },
    lname: {
        type: String,
        required: [true,"name required"],
    },
    email: {
        type: String,
        required: [true, "email required"],
    },
    phone: {
        type: Number,
        required: [true, "phone number required"],
    },
    msg: {
        type: String,
        required: [true, "message requried"],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

module.exports = mongoose.model("Contact", contactSchema);