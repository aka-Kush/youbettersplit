import React, { useState, useEffect } from 'react'

const UpdateGroup = ({onClose, currentSelectedGroupName}) => {

    const [selectedOption, setSelectedOption] = useState();
    const [names, setNames] = useState([]);
    const [selectedSplitUsers, setSelectedSplitUsers] = useState({});
    const [userPercentage, setUserPercentage] = useState({});
    const [userAmount, setUserAmount] = useState({});
    const [paidBy, setPaidBy] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");    
    const [map, setMap] = useState({});    
    const [completeData, setCompleteData] = useState({});   


    const fetchData = async() => {
        const data = await fetch("https://youbettersplit.onrender.com/fetchExistingData", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({groupName: currentSelectedGroupName})
        });
        const res = await data.json();
        if (res.data) {
            const n = [];
            res.data.members.forEach(member => n.push(member));
            setNames(n);
            setMap(res.data.balances);
            setCompleteData(res.data);
        }
    }

    useEffect(() => {
        fetchData();
    },[])


    const handleSelectedSplitUsersChange = (name) => {
        setSelectedSplitUsers((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const handlePercentageChange = (name, value) => {
        setUserPercentage((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAmountChange = (name, value) => {
        setUserAmount((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateMap = (paidBy, split) => {
        Object.keys(map).forEach(key => {
            if(key == paidBy){
                Object.keys(map[key]).forEach(s => {
                    map[key][s] = Math.round(map[key][s] + split[s]);
                }) 
            }
        }) 
    };

    const finalPost = async(data) => {
        await fetch("https://youbettersplit.onrender.com/updateGroup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    function handleSubmit(e){
        e.preventDefault();
        switch(selectedOption){
            case "equally": {
                const splitAmount = parseInt(amount/names.length);
                console.log("splitAmount: ", splitAmount);
                const splitMemberArr = names.filter(e => e != `${paidBy}`);
                const split = {};
                splitMemberArr.forEach((member) => {
                    split[member] = splitAmount;
                })
                console.log("split: ", split)
                updateMap(paidBy, split);
                const data = {
                    groupName: currentSelectedGroupName,
                    members: names,
                    transactions: {
                        note,
                        paidBy,
                        amount,
                        split
                    },
                    balances: map
                }

                finalPost(data);
                break;
            }
            case "select": {
                const selectedNames = [];
                Object.keys(selectedSplitUsers).forEach(key => {
                    if(selectedSplitUsers[key] == true) selectedNames.push(key)
                });

                const split = {};
                const splitAmount = amount / selectedNames.length;
                if(!selectedNames.includes(`${paidBy}`)){
                    selectedNames.forEach(name => {
                        split[name] = splitAmount;
                    })
                } else{
                    selectedNames.forEach(name => {
                        if(name != `${paidBy}`) split[name] = splitAmount;
                    })
                }
                updateMap(paidBy, split);
                const data = {
                    groupName: currentSelectedGroupName,
                    members: names,
                    transactions: {
                        note,
                        paidBy,
                        amount,
                        split
                    },
                    balances: map
                }

                finalPost(data);
                break;
            }
            case "amount": {
                const split = {};
                for(const key in userAmount){
                    if(key != `${paidBy}`) split[key] = parseInt(userAmount[key]);
                }
                updateMap(paidBy, split);
                const data = {
                    groupName: currentSelectedGroupName,
                    members: names,
                    transactions: {
                        note,
                        paidBy,
                        amount,
                        split
                    },
                    balances: map
                }

                finalPost(data);
                break;
            }
            case "percent": {
                const split = {};
                for(const key in userPercentage){
                    if(key != paidBy){
                        let value = userPercentage[key];
                        let calc = parseInt((value * amount) / 100);
                        split[key] = calc;
                    }
                }

                updateMap(paidBy, split);
                const data = {
                    groupName: currentSelectedGroupName,
                    members: names,
                    transactions: {
                        note,
                        paidBy,
                        amount,
                        split
                    },
                    balances: map
                }

                finalPost(data);
                break;
            }
        }
        onClose();
    }

  return (
    <div className='newGroupForm fixed top-[15%] left-2/4  w-[90%] h-[450px] bg-slate-200 @apply -translate-x-2/4 -translate-y-2/4; z-10 overflow-y-scroll scroll-hidden p-4 border-2 border-red-300 rounded-lg'>
        <style>
            {`
                .scroll-hidden {
                    scrollbar-width: none; /* For Firefox */
                }
                .scroll-hidden::-webkit-scrollbar {
                    display: none; /* For Chrome, Safari, and Opera */
                }
            `}
        </style>
        {/* <nav className='w-full bg-slate-500 p-3 sticky top-0'>
            <ul className='flex justify-between'>
                <li className='cursor-pointer' onClick={handleStatementHidden}>Add</li>
                <li className='cursor-pointer' onClick={handleStatementActive}>Statement</li>
            </ul>
        </nav> */}
        <form action="" className='p-4'>
            {/* <input className="w-full p-3 mt-2" type="text" placeholder="Enter group name" value={currentSelectedGroupName} disabled/> */}
            <h1 className='p-3 mt-2 text-center text-2xl'>{currentSelectedGroupName}</h1>
            <input required className="w-full p-3 mt-2" type="text" placeholder='Enter note' value={note} onChange={(e) => setNote(e.target.value)}/>
            <input required className="w-full p-3 mt-2" type="number" placeholder='Enter amount' value={amount} onChange={(e) => setAmount(e.target.value)}/>
            <label className="" htmlFor="">Paid by</label>

            <select className='m-4 p-2' name="" id="" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} defaultValue={"Choose"}>
            <option>Choose</option>
            {names.map((name, idx) => (
                <option value={name} key={idx}>{name}</option>
            ))}
            </select>

            <br />
            
            <label htmlFor="">split</label>
            <select className='m-4 p-2' name="" id="" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} defaultValue={"Choose"}>
                <option>Choose</option>
                <option value="equally">equally</option>
                <option value="select">select members to split</option>
                <option value="percent">different percentage</option>
                <option value="amount">different amount</option>
            </select>

            {selectedOption == "select" && (
                names.map((name, index) => (
                    <div key={index} className='m-4'>
                        <label htmlFor={name}>{name}</label>
                        <input className='m-2' type="checkbox" name={name} id={name} checked={selectedSplitUsers[name] || false}
                        onChange={() => handleSelectedSplitUsersChange(name)}/>
                    </div>
                ))
            )}

            {selectedOption == "percent" &&(
                names.map((name, index) => (
                    <div key={index} className='m-4'>
                        <label htmlFor={name}>{name}</label>
                        <input className='w-full p-2' type="number" placeholder='Enter percentage..' name={name} id={name} value={userPercentage[name] || ""}
                        onChange={(e) => handlePercentageChange(name, e.target.value)}/>
                    </div>
            ))
            )}
            
            {selectedOption == "amount" &&(
                names.map((name, index) => (
                        <div key={index} className='m-4'>
                            <label htmlFor={name}>{name}</label>
                            <input className='p-2 w-full' type="number" placeholder='Enter amount..' name={name} id={name} value={userAmount[name] || ""}
                            onChange={(e) => handleAmountChange(name, e.target.value)}/>
                        </div>
                    ))
            )}
            <br />
        
            <div className='pb-10 w-full flex justify-between'>
            <button  className="border-2 bg-blue-400 p-4 mt-2" type='submit' onClick={(e) => handleSubmit(e)}>Submit</button>
            <button  className='border-2 bg-red-400 p-4 mt-2' type='submit' onClick={onClose}>Close</button>
            </div>

        </form>
        
    </div>
  )
}

export default UpdateGroup