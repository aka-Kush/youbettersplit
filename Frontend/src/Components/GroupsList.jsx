import { useEffect, useState } from "react"
import UpdateGroup from "./UpdateGroup";

const GroupsList = () => {    
    const [groupName, setGroupName] = useState([]);
    const [isUpdateGroupVisible, setIsUpdateGroupVisible] = useState(false);
    const [currentSelectedGroupName, setCurrentSelectedGroupName] = useState(null);
    const [clicked, setClicked] = useState(false);

    const fetchData  = async() => {
        let response = await fetch("https://youbettersplit.onrender.com/fetchGroupDetails");
        let res = await response.json();
        if(res && Array.isArray(res.data)){
            setGroupName(res.data.map(g => g.groupName));
        }
    }

    useEffect(() => {
        fetchData();
    }, [isUpdateGroupVisible])

    function openUpdateGroup(e){
        setCurrentSelectedGroupName(e.target.parentElement.name)
        setIsUpdateGroupVisible(true);
    }

    function handleReload(){
        fetchData();
        setClicked(prev => !prev);
    }

    const deleteGroup = async(e) => {
        const groupName = e.target.parentElement.name;
            await fetch("https://youbettersplit.onrender.com/deleteGroup",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({groupName})
            })
        handleReload();
    }

    function closeUpdateGroup(){
        setIsUpdateGroupVisible(false);
    }

    return(
        <div className="" onClick={handleReload} >
            {groupName.map((name, index) => (
                <div className="border-2 bg-sky-300 w-full p-10 flex justify-between mt-2" key={index}>
                <h2 className="text-2xl">{name}</h2>
                <div>
                <button name={name} onClick={(e) => openUpdateGroup(e)}><i className="mx-3 fa-solid fa-pen-to-square"></i></button>
                <button name={name} onClick={(e) => deleteGroup(e)}><i className="mx-3 fa-solid fa-trash"></i></button>
                </div>
                </div>
            ))}
            <div  className="">
            {isUpdateGroupVisible && <UpdateGroup onClose={closeUpdateGroup} currentSelectedGroupName={currentSelectedGroupName}/>}
            </div>
        </div>
    )
}

export default GroupsList