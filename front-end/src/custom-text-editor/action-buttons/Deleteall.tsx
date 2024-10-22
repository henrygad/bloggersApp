import { RiDeleteBin5Line } from "react-icons/ri";

type Props = {
    handleDeleteAlll: () => void
};

const Deleteall = ({handleDeleteAlll}: Props) => {
    
  return <div id='detele-all-inputs-from-inputarea' className="flex items-center">
    <button className="block cursor-pointer" onClick={handleDeleteAlll} >
      <RiDeleteBin5Line size={24} />
    </button>
  </div>
};

export default Deleteall;
