import { Link } from "react-router-dom";
import { UsershortInforprops } from "../entities";
import { useFetchData} from "../hooks"
import Displayimage from "./Displayimage";


const UsershortInfor = ({ userName }: { userName: string }) => {
    if (!userName) return;
    const { data, loading, error } = useFetchData('/api/users/' + userName, [userName]);
    const profileData: UsershortInforprops  = data as any
    if (!profileData) return;

    (error)

    return<Link to={'/'+ userName} className="flex items-start justify-start gap-3 w-full">
            {!loading ?
                <>
                    <Displayimage
                        id={'avater'}
                        imageUrl={"/api/image/" + profileData.displayImage}
                        parentClass='h-11 w-11'
                        imageClass='object-contain rounded-full border-2 border-green-300'
                        onClick={() => ''}
                    />
                    <div className='flex flex-col font-secondary '>
                        <span id='name' className='text-base font-semibold  ' >{profileData.name}</span>
                        <span id='userName' className='text-[0.8rem] opacity-50 ' >{profileData.userName}</span>
                    </div>
                </>
                :
                <div>loading profile...</div>}
        </Link>
   
}

export default UsershortInfor
