import React, { useEffect, useState } from 'react'
import {format} from 'date-fns'

const ViewGroup = ({onClose, currentSelectedGroupName}) => {

  const [names, setNames] = useState([]);
  const [map, setMap] = useState({});
  const [totalStatement, setTotalStatement] = useState({});    
  const [completeData, setCompleteData] = useState({});   
  const [loading, setLoading] = useState(true);   
  const [statLoading, setStatLoading] = useState(true);   
  const [statementActive, setStatementActive] = useState(false);    
  const [balanceDivActive, setBalanceDivActive] = useState(true);   
  const [reloadTrans, setReloadTrans] = useState(false); 

  const fetchData = async() => {
    const data = await fetch("https://youbettersplit.onrender.com/fetchExistingData", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({groupName: currentSelectedGroupName})
    })
    const res = await data.json();
    try{
      if(res){
        setNames(res.data.members);
        setMap(res.data.balances);
        setCompleteData(res.data);
      } 
    } catch(e){
      console.log("error", e)
    } finally {
      setLoading(false);
    }
  }

  function dateFormat(date){
    const formattedData = format(new Date(date), 'dd MMM, h:mm a');
    return formattedData
  }

  const processTotals = () => {
    let user = "Shivansh";
    let total = {};

    for(const payer in map){
      if(payer !== user) total[payer] = 0
    }

    for(const payer in map){
      if(payer === user){
        for(const reciever in map[user]){
          total[reciever] = Math.round(total[reciever] + map[payer][reciever])
        }
      } else{
        if(map[payer][user]) total[payer] = Math.round(total[payer] - map[payer][user])
      }
    }
    setTotalStatement(total);
}

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      processTotals();
    }
  }, [loading, names, map]);

    const handleStatementActive = () => {
      try{
          fetchData();
          setStatementActive(true);  
          setBalanceDivActive(false)
      } finally{
          setStatLoading(false);
      }
  }

  const handleStatementHidden = () => {
      fetchData();
      setStatementActive(false);
      setBalanceDivActive(true);
  }

  function ReloadTrans(){
    setReloadTrans(prev => !prev)
  }

    const deleteTransaction = async(note, split, paidBy, amount) => {
        Object.keys(split).forEach(s => {
            map[paidBy][s] = Math.round(map[paidBy][s] - split[s]) 
        })
        const data = await fetch("https://youbettersplit.onrender.com/deleteTransaction", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({note, split, paidBy, amount, map, currentSelectedGroupName})
        });
        let res = await data.json(); 
        setMap(res.data.balances);
        setCompleteData(res.data);
        ReloadTrans();
    }

  return (
    <div className='fixed overflow-auto top-[10%] left-2/4 w-[90%] h-[450px] bg-slate-200 @apply -translate-x-2/4 -translate-y-2/4; z-10 overflow-y-scroll scroll-hidden p-2 border-2 border-red-300 rounded-lg'>
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

        <div className='mx-3' style={{ display: balanceDivActive ? 'block' : 'none' }}>
        {loading ? (<p>Loading...</p>) : (
        <>
        <h3 className='text-2xl font-semibold mt-4 text-center'>{completeData.groupName}</h3>
        <div className='bg-red-400 mt-4 text-center flex flex-col items-center'>
        <label htmlFor="" className='mt-2'>Members:</label>
        <ul className='flex my-2'>
        {names.filter(name => name != "Shivansh").map((name, idx) => (
          <div key={idx}>
            <li className='mx-2'>{name}</li>
          </div>
        ))}
        </ul>
        </div>
        
        <h4 className='text-xl mt-4 mb-2'>Total Balance: </h4>
        
        {Object.keys(totalStatement).map((key, idx) => (
          <div key={idx}>
            <p>{key}: <span>{totalStatement[key]}</span></p>
          </div>
        ))}

      <div className='w-full flex justify-center mt-8 flex-col'>
        <button className='bg-blue-400 p-4 mt-2 ' onClick={handleStatementActive}>View Statements</button>
        <button className='bg-red-400 p-4 mt-2 ' onClick={onClose}>Close</button>
      </div>

    </>
    )}
      </div>


      <div className='w-80 h-72' onClick={ReloadTrans} style={{ display: statementActive ? 'block' : 'none' }}>
        {statLoading ? (<p>Loading...</p>) : (
            <div>
            <h3 className='mt-4 p-4 text-2xl'>Statements:</h3>
            <div className='w-full flex flex-col items-center'>
            {completeData.transactions && 
                completeData.transactions.map((trans, index) => (
                    <div key={index} className='w-[90%] p-3 bg-slate-300 rounded-md flex justify-between items-center my-2'>
                        <div className='flex flex-col w-[40%] overflow-hidden'>
                            <h4 className='text-lg'>{trans.note}</h4>
                            <span className='text-sm'>{trans.paidBy}</span>
                            <span className='text-sm'>{dateFormat(trans.date)}</span>
                        </div>
                        <div>
                            {Object.keys(trans.split).map((item, idx) => (
                                <li className='list-none p-0 m-0' key={idx}>{item}:<span className='text-green-700 ml-2'>{trans.split[item]}</span></li>
                            ))}
                        </div>
                        <i className="fa-solid fa-trash cursor-pointer" onClick={() => deleteTransaction(trans.note, trans.split, trans.paidBy, trans.amount)}></i>
                    </div>
                ))
            }
            </div>
            <div className='w-full flex justify-center my-6'>
                <button className='bg-red-400 p-4 mt-2' onClick={handleStatementHidden}>Close</button>
            </div>
            </div>
        )}
      </div>

    </div>
  )
}

export default ViewGroup