const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    note: String,
    paidBy: String,
    amount: Number,
    split: {
        type: Map,
        of: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});


const groupSchema = new mongoose.Schema({
    groupName: String,
    members: [String],
    transactions: [transactionSchema],
    balances: {
        type: Map,
        of: Map
    },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group