import { useState, useRef } from "react"
import GroupsList from "../Components/GroupsList"
// import NewGroup from "../Components/NewGroup"

const Home = () => {

  const modalRef = useRef(null);

  function toggleModal(){
    const modal = modalRef.current;
    if(modal.classList.contains('hidden')){
      modal.classList.remove("hidden")
    } else{
      modal.classList.add("hidden")
    }
  }

  function handleSubmit(e){
    e.preventDefault();
    for(let i = 1 ; i <= numDivs; i++){
      let name = document.getElementById(`nameInput${i}`).value;
      members.name.push(name);
    }
    fetch('http://localhost:8080/new-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({groupName, members})
    })
    toggleModal();
  }
  
  function handleChange(e){
    const value = e.target.value;
    setNumDivs(Number(value));
  }

  const [numDivs, setNumDivs] = useState(0);
  const [groupName, setGroupName] = useState("");
  // const [nameInput, setNameInput] = useState([]);
  let members = {name:[]};

  return (
    <div className="border-2 bg-red-200 w-screen h-screen">
      <div className="mt-20">
        <div className="border-2 w-fit rounded-lg bg-green-300 text-lg">
          <button onClick={toggleModal} className="p-5">
              New Group
              <i className="ml-4 fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
      <div ref={modalRef} className="newGroupForm fixed top-[25%] left-2/4 w-fit bg-slate-200 p-4 @apply -translate-x-2/4 -translate-y-2/4; hidden">
        <form action="">
          <input className="w-full p-3 mt-2" type="text" placeholder="Enter group name" value={groupName} onChange={(e) => {setGroupName(e.target.value)}}/>
          <input type="number" min={0} className="w-full p-3 mt-2" placeholder="Enter number of members" onChange={handleChange} value={numDivs}/>
          <div className="mt-4">
            {Array.from({ length: numDivs }, (_, index) => (
              <input key={index} id={`nameInput${index+1}`} className="p-3 mt-2 w-full" placeholder={`Enter name of person ${index+1}`}>
              </input>
            ))}
          </div>
          <div className="w-full flex justify-center">
            <button className="border-2 bg-blue-400 p-4 mt-6" onClick={(e) => handleSubmit(e)}>Submit</button>
          </div>
        </form>
      </div>
      <div className="mt-10">
        <GroupsList />
      </div>
    </div>
  )
}

export default Home