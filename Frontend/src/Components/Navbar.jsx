const Navbar = () => {
  return (
    <div className="w-full h-14 bg-slate-200 fixed top-0 flex justify-between items-center font-bold p-5">
        {/* <div>
            Shivansh Kush
        </div> */}
        <div className="text-xl text-red-400">
            Better Split
        </div>
        {/* <div>
            Sunday, 13 October
        </div> */}
        <div className="flex">
            <div className="mx-1 w-6 rounded-full bg-green-400 h-6"></div>
            <div className="mx-1 w-6 rounded-full bg-yellow-400 h-6"></div>
            <div className="mx-1 w-6 rounded-full bg-red-400 h-6"></div>
        </div>
    </div>
  )
}

export default Navbar