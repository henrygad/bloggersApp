import { ReactElement, createContext, useState } from "react";

type Contextprops = {
    imageGalary: {
        displayImageGalary: string;
        selectedImages: string[];
    }
    setImageGalary: React.Dispatch<React.SetStateAction<{
        displayImageGalary: string;
        selectedImages: string[];
    }>>
};

const declearImageGalary = {
    displayImageGalary: '',
    selectedImages: []
}

export const Context = createContext<Contextprops>({
    imageGalary: declearImageGalary,
    setImageGalary: (declearImageGalary) => null
});

const Imagegalarycontext = ({ Children }: { Children: ReactElement }) => {
    const [imageGalary, setImageGalary] = useState<Contextprops['imageGalary']>(declearImageGalary);

    return <Context.Provider value={{ imageGalary, setImageGalary }}>
        {Children}
    </Context.Provider>
};

export default Imagegalarycontext;
