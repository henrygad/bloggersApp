import { useContext } from "react";
import { Context } from "../contexts/Imagegalarycontexts";


const useImageGalary = () => {
    const { imageGalary, setImageGalary } = useContext(Context);

    return { imageGalary, setImageGalary };
};

export default useImageGalary;
