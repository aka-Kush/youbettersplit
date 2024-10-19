import { useState} from "react"
import GroupsList from "../Components/GroupsList"
import NewGroup from "../Components/NewGroup";

const Home = () => {

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  function openDialog(){
    setIsDialogVisible(true);
  }

  function closeDialog(){
    setIsDialogVisible(false);
  }

  return (
    <div className="w-[80%] mt-6 m-auto flex flex-col items-center">
      <div className="mt-20 w-full flex justify-center">
        <div className="w-[40%] rounded-lg bg-green-300 text-lg">
          <button onClick={openDialog} className="p-4 w-full flex items-center justify-center">
              New Group
              <i className="fa-solid fa-plus ml-6"></i>
          </button>
        </div>
      </div>
      {isDialogVisible && <NewGroup onClose={closeDialog}/>}
      <div className="mt-10 w-[50%]">
        <GroupsList/>
      </div>
    </div>
  )
}

export default Home