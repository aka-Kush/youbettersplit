const express = require('express');
const router = express.Router();
const Group = require("../Schemas/Group.jsx")

router.post("/new-group", async(req, res) => {
    const {groupName, members, balances} = await req.body;
    const group = new Group({
        groupName,
        members,
        balances
    })
    const data = await group.save();
    console.log(data);
    res.json({group});
})

router.get("/fetchGroupDetails", async (req, res) => {
    const data = await Group.find({});
    res.json({ data });
});

router.post("/fetchExistingData", async (req, res) => {
    const {groupName} = req.body;
    const data = await Group.findOne({groupName});
    res.json({ data });
});

router.post("/updateGroup", async(req, res) => {
    const {
        groupName,
        members,
        transactions,
        balances
    } = req.body;
    const grp = await Group.updateOne({groupName}, {
        $set: {
            members,
            balances
        },
        $push:{
            transactions: transactions
        }
    })
    res.json({grp});
})

router.post("/deleteTransaction", async(req, res) => {
    const {note} = req.body;
    try{
        const {groupName} = await Group.findOne({ 'transactions.note': note });
        await Group.deleteOne({groupName});
        res.json({delete: true});
    } catch(e){
        res.json({delete: false, error: e});
    }
})


module.exports = router