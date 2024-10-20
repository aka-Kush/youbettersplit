import React, { useEffect, useState } from 'react'

const ViewGroup = ({onClose, currentSelectedGroupName}) => {

  const [names, setNames] = useState([]);
  const [map, setMap] = useState({});
  const [totalStatement, setTotalStatement] = useState({});    
  const [completeData, setCompleteData] = useState({});   
  const [loading, setLoading] = useState(true);   

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
      setLoading(false); // Set loading to false after fetching data
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      processTotals();
    }
  }, [loading, names, map]);

  return (
    <div className='fixed overflow-auto top-[10%] left-2/4 min-w-[300px] min-h-[450px] bg-slate-200 @apply -translate-x-2/4 -translate-y-2/4; z-10 overflow-y-scroll scroll-hidden p-4 border-2 border-red-300 rounded-lg'>
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

      <div className=''>
        {loading ? (<p>Loading...</p>) : (
          <>
        <h3 className='text-2xl font-semibold mt-4 text-center'>{completeData.groupName}</h3>
        <div className='bg-red-400 mt-4 text-center flex flex-col items-center'>
        <label htmlFor="" className='mt-2'>Members:</label>
        <ul className='flex my-2'>
        {names.map((name, idx) => (
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
      </>
      )}

      </div>
      <div className='w-full flex justify-center mt-8'>
        <button className='bg-red-400 p-4 mt-2' onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default ViewGroup