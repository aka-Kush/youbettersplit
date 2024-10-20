import { useEffect, useState } from "react"
import UpdateGroup from "./UpdateGroup";
import ViewGroup from "./ViewGroup";

const GroupsList = () => {    
    const [groupName, setGroupName] = useState([]);
    const [isUpdateGroupVisible, setIsUpdateGroupVisible] = useState(false);
    const [currentSelectedGroupName, setCurrentSelectedGroupName] = useState(null);
    const [toggleGroupViewVisibility, setToggleGroupViewVisibility] = useState(false);

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

    function viewGroup(e){
        setCurrentSelectedGroupName(e.target.parentElement.name)
        setToggleGroupViewVisibility(true);
    }

    function closeViewGroup(){
        setToggleGroupViewVisibility(false);
    }

    function openUpdateGroup(e){
        setCurrentSelectedGroupName(e.target.parentElement.name)
        setIsUpdateGroupVisible(true);
    }

    const deleteGroup = async(e) => {
        const groupName = e.target.parentElement.name;
        setGroupName(prevGroupNames => 
            prevGroupNames.filter(name => name !== (e.target.parentElement.name))
        ); 
            await fetch("https://youbettersplit.onrender.com/deleteGroup",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({groupName})
            })
    }

    function closeUpdateGroup(){
        setIsUpdateGroupVisible(false);
    }

    return(
        <div className="">
            {groupName.map((name, index) => (
                <div className="bg-sky-300 w-full p-10 flex justify-between mt-2 rounded-md" key={index}>
                <h2 className="text-2xl">{name}</h2>
                <div>
                <button name={name} className="mr-3" onClick={(e) => viewGroup(e)}><i className="fa-solid fa-eye"></i></button>
                <button name={name} onClick={(e) => openUpdateGroup(e)}><i className="mx-3 fa-solid fa-pen-to-square"></i></button>
                <button name={name} onClick={(e) => deleteGroup(e)}><i className="mx-3 fa-solid fa-trash"></i></button>
                </div>
                </div>
            ))}
            <div  className="">
            {isUpdateGroupVisible && <UpdateGroup onClose={closeUpdateGroup} currentSelectedGroupName={currentSelectedGroupName}/>}
            </div>
            <div  className="">
            {toggleGroupViewVisibility && <ViewGroup onClose={closeViewGroup} currentSelectedGroupName={currentSelectedGroupName}/>}
            </div>
        </div>
    )
}

export default GroupsList