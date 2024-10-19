import { useEffect, useState } from "react"
import UpdateGroup from "./UpdateGroup";

const GroupsList = () => {    
    const [groupName, setGroupName] = useState([]);
    const [isUpdateGroupVisible, setIsUpdateGroupVisible] = useState(false);
    const [currentSelectedGroupName, setCurrentSelectedGroupName] = useState(null);

    useEffect(() => {
        const fetchData  = async() => {
            let response = await fetch("https://youbettersplit-backend.vercel.app/fetchGroupDetails");
            let res = await response.json();
            if(res && Array.isArray(res.data)){
                setGroupName(res.data.map(g => g.groupName));
            }
        }
        fetchData();
    }, [])

    function openUpdateGroup(e){
        setCurrentSelectedGroupName(e.target.parentElement.name)
        setIsUpdateGroupVisible(true);
    }

    function closeUpdateGroup(){
        setIsUpdateGroupVisible(false);
    }

    return(
        <div className="">
            {groupName.map((name, index) => (
                <div className="border-2 bg-sky-300 w-full p-10 flex justify-between mt-2" key={index}>
                <h2 className="text-2xl">{name}</h2>
                <button name={name} onClick={(e) => openUpdateGroup(e)}><i className="fa-solid fa-pen-to-square"></i></button>
                </div>
            ))}
            <div  className="">
            {isUpdateGroupVisible && <UpdateGroup onClose={closeUpdateGroup} currentSelectedGroupName={currentSelectedGroupName}/>}
            </div>
        </div>
    )
}

export default GroupsList