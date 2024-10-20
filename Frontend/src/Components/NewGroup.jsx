import { useState } from "react";

const NewGroup = ({onClose}) => {

  const [numDivs, setNumDivs] = useState(0);
  const [groupName, setGroupName] = useState("");

  function handleChange(e){
    const value = e.target.value;
    setNumDivs(Number(value));
  }

  function handleSubmit(e){
    const members = [];
    e.preventDefault();
    for(let i = 1 ; i <= numDivs; i++){
      let name = document.getElementById(`nameInput${i}`).value;
      members.push(name);
    }
    
    let balances = {};
    members.forEach(name => {
      balances[name] = {};
      members.forEach(inner => {
        if(name != inner){
          balances[name][inner] = 0;
        }
      })
    })


    fetch('https://youbettersplit.onrender.com/new-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({groupName, members, balances})
    })
    onClose();
  }
  
  return (

    <div className="newGroupForm fixed top-[25%] left-2/4 w-fit bg-slate-200 p-4 @apply -translate-x-2/4 -translate-y-2/4; z-10">
    <form action="">
      <input  required className="w-full p-3 mt-2" type="text" placeholder="Enter group name" value={groupName} onChange={(e) => {setGroupName(e.target.value)}}/>
      <input required type="number" min={0} className="w-full p-3 mt-2" placeholder="Enter number of members" onChange={handleChange} value={numDivs}/>
      <div className="mt-4">
        {Array.from({ length: numDivs }, (_, index) => (
          <input key={index} id={`nameInput${index+1}`} className="p-3 mt-2 w-full" placeholder={`Enter name of person ${index+1}`} required>
          </input>
        ))}
      </div>
      <div className="w-full flex justify-center">
        <button className="border-2 bg-green-400 p-4 mt-6" onClick={(e) => handleSubmit(e)}>Submit</button>
        <button className="border-2 bg-red-400 p-4 mt-6" onClick={onClose}>Close</button>
      </div>
    </form>
  </div>
  )
}

export default NewGroup