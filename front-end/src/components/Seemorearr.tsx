import { useState } from "react";

const Seemorearr = <T,>(
    { arr, initialSeeMore, callBack, incrementBy, handleSeeMore = (callBack) => null, arrWrapperClassName }:
        { arr: T[] | null, initialSeeMore: number, callBack: (item: T, index: number) => JSX.Element, incrementBy: number, handleSeeMore: (callBack: () => void) => void, arrWrapperClassName: string, }) => {
    const [seeMore, setSeeMore] = useState(initialSeeMore);


    return <>
        {arr &&
            arr.length ?
            <>
                {
                    <div className={arrWrapperClassName} >
                        {
                            arr.map((item, index) => {
                                if (index === seeMore) {
                                    return;
                                } else {
                                    return callBack(item, index)
                                };
                            })
                        }
                    </div>
                }
                <div className="flex items-center justify-center">
                    {(arr.length - seeMore) > 0 ?
                        <span className="cursor-pointer" onClick={() => { handleSeeMore(() => { setSeeMore(pre => pre += incrementBy) }) }}>{
                            'View' + ' ' + (arr.length) + ' ' + 'replies'
                        }</span> :

                        <span className="cursor-pointer" onClick={() => setSeeMore(initialSeeMore)}>close replies</span>
                    }
                </div>
            </> :
            <div>empty array</div>
        }
    </>
};

export default Seemorearr;
