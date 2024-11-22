import { Link } from "react-router-dom";
import { UsershortInforprops } from "../entities";
import { useFetchData } from "../hooks"
import Displayimage from "./Displayimage";
import { useEffect, useState } from "react";
import avaterPlaceholder from '../assert/avaterplaceholder.svg'


const UsershortInfor = ({ userName, displayName = true }: { userName: string, displayName?: boolean }) => {
    const localStorageUserData: UsershortInforprops = JSON.parse(localStorage.getItem(userName) || 'null');
    const { data, loading: loadingUser } = useFetchData<UsershortInforprops>('/api/users/' + userName, [userName]);
    const [userData, setUserData] = useState<UsershortInforprops | null>(localStorageUserData);

    useEffect(() => {
        if (data) {
            setUserData(data)
            localStorage.setItem(data.userName, JSON.stringify(data));
        };
    }, [!data]);

    return <div>
        {userData ?
            <Link to={'/' + userName} className="flex items-start justify-start gap-3 w-full">
                {
                    userData ?
                        <>
                            <Displayimage
                                id={'avater'}
                                placeHolder={avaterPlaceholder}
                                imageId={userData.displayImage}
                                parentClass='h-11 w-11'
                                imageClass='object-contain rounded-full'
                                onClick={() => ''}
                            />
                            {displayName ?
                                <div className='flex flex-col font-secondary '>
                                    <span id='name' className='text-base font-semibold  ' >{userData.name}</span>
                                    <span id='userName' className='text-[0.8rem] opacity-50 ' >{userData.userName}</span>
                                </div> :
                                null}
                        </> :
                        null
                }
            </Link>
            :
            <div className="h-11 w-11">loading profile...</div>}
    </div>

}

export default UsershortInfor
