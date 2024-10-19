import React, { useState } from 'react'

const ViewGroup = ({onClose, currentSelectedGroupName}) => {

  const [names, setNames] = useState([]);
  const [map, setMap] = useState({});
  const [totalStatement, setTotalStatement] = useState({});    
  const [completeData, setCompleteData] = useState({});    

  const fetchData = async() => {
    const data = await fetch("https://youbettersplit.onrender.com/fetchExistingData", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({currentSelectedGroupName})
    })
    const res = await data.json();
    console.log(res)
    if(res){
      setNames(data.data.members);
      setMap(data.data.balances);
      setCompleteData(data.data);
    }
  }

  const processTotals = () => {
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

  useState(() => {
    fetchData();
    processTotals();
  },[])

  return (
    <div className='newGroupForm fixed overflow-auto top-[15%] left-2/4 min-w-[300px] min-h-[450px] bg-slate-200 @apply -translate-x-2/4 -translate-y-2/4; z-10 overflow-y-scroll scroll-hidden'>
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

      <div className='flex flex-col items-center'>
        <h3>{completeData.groupName}</h3>
        <ul>
        {names.map((name, idx) => (
          <div key={idx}>
          <li>Member1</li>
          <li>Member1</li>
          <li>Member1</li>
          </div>
        ))}
        </ul>
        
        {Object.keys(totalStatement).map((key, idx) => (
          <div key={idx}>
            <p>{key}: <span>totalStatement[key]</span></p>
          </div>
        ))}

      </div>
      
      <button className='bg-red-400 p-4 mt-2' onClick={onClose}>Close</button>
    </div>
  )
}

export default ViewGroup