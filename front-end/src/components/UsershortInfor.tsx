import { Link } from "react-router-dom";
import { UsershortInforprops } from "../entities";
import { useFetchData } from "../hooks"
import Displayimage from "./Displayimage";
import { useEffect, useState } from "react";


const UsershortInfor = ({ userName }: { userName: string }) => {
    const { data, loading: loadingUser } = useFetchData<UsershortInforprops>('/api/users/' + userName);
    const [userData, setUserData] = useState<UsershortInforprops | null>(null);

    useEffect(()=>{
        setUserData(data);
    }, [data]);

    return <div>
        {!loadingUser ?
            <Link to={'/' + userName} className="flex items-start justify-start gap-3 w-full">
                {
                    userData ?
                        <>
                            <Displayimage
                                id={'avater'}
                                imageUrl={"/api/image/" + userData.displayImage}
                                parentClass='h-11 w-11'
                                imageClass='object-contain rounded-full border-2 border-green-300'
                                onClick={() => ''}
                            />
                            <div className='flex flex-col font-secondary '>
                                <span id='name' className='text-base font-semibold  ' >{userData.name}</span>
                                <span id='userName' className='text-[0.8rem] opacity-50 ' >{userData.userName}</span>
                            </div>
                        </> :
                        null
                }
            </Link>
            :
            <div>loading profile...</div>}
    </div>

}

export default UsershortInfor
