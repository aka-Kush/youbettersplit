const mongoose = require("mongoose")

// const splitSchema = new mongoose.Schema({
//     member: String,
//     amount: Number
// });

const transactionSchema = new mongoose.Schema({
    note: String,
    paidBy: String,
    amount: Number,
    split: {
        type: Map,
        of: Number
    }
});


const groupSchema = new mongoose.Schema({
    groupName: String,
    members: [String],
    transactions: [transactionSchema],
    balances: {
        type: Map,
        of: Map
    }
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group