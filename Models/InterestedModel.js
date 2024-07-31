const mongoose = require("mongoose");

const interestedSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    }
});

interestedSchema("save");

module.exports = mongoose.model("Interested", interestedSchema);