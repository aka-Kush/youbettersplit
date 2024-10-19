const express = require('express');
const router = express.Router();
const Group = require("../Schemas/Group.jsx")

router.post("/new-group", async(req, res) => {
    const {groupName, members, balances} = await req.body;
    // console.log(balances)
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
    // console.log(groupName)
    const data = await Group.findOne({groupName});
    // console.log(data);
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
        // $push:{
        //     transactions: { $each: transactions }
        // }
        $push:{
            transactions: transactions
        }
    })
    res.json({grp});
})


module.exports = router