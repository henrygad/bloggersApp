import { Followbutton, Userdotnav, UsershortInfor } from "../components";
import { useUserIsLogin } from "../hooks";


const Followerssec = ({ arrOfFollowers }: { arrOfFollowers: string[] }) => {
    const { loginStatus: { loginUserName } } = useUserIsLogin();
    
    return <div className="space-y-3">
        <span >Followers {arrOfFollowers && arrOfFollowers.length ? arrOfFollowers.length : 0}</span>
        {arrOfFollowers &&
            arrOfFollowers.length ?
            <>
                {
                    arrOfFollowers.map((item, index) =>
                        <div key={item} className={`relative py-4 ${index % 2 == 0 ? 'border-b rounded-md' : 'border-none'}`}>
                            <div className="flex items-start gap-3 pr-10 pl-2">
                                <UsershortInfor userName={item} />
                                <Userdotnav userName={item} />
                                {loginUserName === item ?
                                    null :
                                    <Followbutton userNameToFollow={item} />
                                }
                            </div>
                        </div>
                    )
                }</> :
            <div>no followers </div>}
    </div>
};

export default Followerssec;
