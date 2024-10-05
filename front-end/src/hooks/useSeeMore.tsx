import { ReactDOM, ReactHTML, useState } from "react";


const useSeeMore = <T,>(see: number = 0,) => {
    const [seeMore, setSeeMore] = useState(see);

    const Trimarr = ({ arr, callBack }: { id: string, arr: T[] | [], callBack: (item: T, index: number) => JSX.Element }) => {
        return arr.map((item, index) =>{
                if(index === seeMore){
                    return;
                } else {
                    return callBack(item, index)
                };
            });
    };

    return { Trimarr, seeMore, setSeeMore };
};

export default useSeeMore;
