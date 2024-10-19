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
    const [statementActive, setStatementActive] = useState(false);    
    const [totalStatement, setTotalStatement] = useState({});    
    const [completeData, setCompleteData] = useState({});    

    useEffect(() => {
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
                res.data.members.forEach(member => setNames(prev => [...prev, member]));
                setMap(res.data.balances);
                setCompleteData(res.data);
            }
        }
        fetchData();
    },[currentSelectedGroupName])

    const handleStatementActive = () => {
        setStatementActive(true);  
        processStatements();
    }

    const handleStatementHidden = () => {
        setStatementActive(false);
    }


    const handleSelectedSplitUsersChange = (name) => {
        setSelectedSplitUsers((prev) => ({
            ...prev,
            [name]: !prev[name], // Toggle the checked state
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

    const deleteTransaction = async(note, split, paidBy) => {
        Object.keys(split).forEach(s => {
            map[paidBy][s] = Math.round(map[paidBy][s] - split[s]) 
        })
        await fetch("https://youbettersplit.onrender.com/deleteTransaction", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({note})
        });
    }

    const updateMap = (paidBy, split) => {
        Object.keys(map).forEach(key => {
            if(key == paidBy){
                Object.keys(map[key]).forEach(s => {
                    map[key][s] += split[s];
                }) 
            }
        }) 
    };

    const finalPost = async(data) => {
        const response = await fetch("https://youbettersplit.onrender.com/updateGroup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    const processStatements = () => {
        let user = "Shivansh";
        let total = {};
        let filterNames = names.filter(key => key != user)
        filterNames.forEach(name => total[name] = 0);
        Object.keys(map).forEach(outer => {
            if(outer == user){
                Object.keys(map[outer]).forEach(key => {
                    total[key]  = Math.round(total[key] + map[outer][key]);
                })
            } else{
                if (map[outer][user]) {
                    total[outer] = Math.round(total[outer] - map[outer][user]);
                }
            }
        })
        setTotalStatement(total);
    }

    function handleSubmit(e){
        e.preventDefault();
        switch(selectedOption){
            case "equally": {
                const splitAmount = amount/names.length;
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
    <div className='newGroupForm fixed overflow-auto top-[15%] left-2/4 min-w-[300px] min-h-[450px] bg-slate-200 @apply -translate-x-2/4 -translate-y-2/4; z-10'>
        <nav className='w-full bg-slate-500 p-3 fixed top-0'>
            <ul className='flex justify-between'>
                <li className='cursor-pointer' onClick={handleStatementHidden}>Add</li>
                <li className='cursor-pointer' onClick={handleStatementActive}>Statement</li>
            </ul>
        </nav>
        <form action="" className='p-4 my-6 mx-4 h-24 w-96' style={{ display: !statementActive ? 'block' : 'none' }}>
            <input className="w-full p-3 mt-2" type="text" placeholder="Enter group name" value={currentSelectedGroupName} disabled/>
            <input className="w-full p-3 mt-2" type="text" placeholder='Enter note' value={note} onChange={(e) => setNote(e.target.value)}/>
            <input className="w-full p-3 mt-2" type="number" placeholder='Enter amount' value={amount} onChange={(e) => setAmount(e.target.value)}/>
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
        <div className='h-24 w-96' style={{ display: statementActive ? 'block' : 'none' }}>
            <h3 className='mt-16 p-4 text-2xl'>Statements:</h3>
            <div className='w-full flex flex-col items-center'>
            {completeData.transactions && 
                completeData.transactions.map((trans, index) => (
                    <div key={index} className='w-[90%] p-3 bg-slate-400 border-slate-700 border-2 flex justify-between items-center'>
                        <div>
                            <h4>{trans.note}</h4>
                            <span>{trans.paidBy}</span>
                        </div>
                        <div>
                            {Object.keys(totalStatement).map(item => (
                                <li className='list-none p-0 m-0' key={item}>{item}:<span className='text-green-700'>{totalStatement[item]}</span></li>
                            ))}
                        </div>
                        <i className="fa-solid fa-trash" onClick={() => deleteTransaction(trans.note, trans.split, trans.paidBy)}></i>
                    </div>
                ))
            }
            </div>
            <div className='w-full flex justify-center mt-6'>
                <button className='bg-red-400 p-4 mt-2' onClick={onClose}>Close</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateGroup