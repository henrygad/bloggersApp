import { Followbutton, Userdotnav, UsershortInfor } from "../components";
import { useUserIsLogin } from "../hooks";


const Followingsec = ({ arrOfFollowing }: { arrOfFollowing: string[] }) => {
     const { loginStatus: { loginUserName } } = useUserIsLogin();

    return <div className="space-y-3">
        <span >Following {arrOfFollowing && arrOfFollowing.length ? arrOfFollowing.length : 0}</span>

        {arrOfFollowing &&
            arrOfFollowing.length ?
            <>
                {
                    arrOfFollowing.map((item, index) =>
                        <div key={item} className={`relative py-4 ${index % 2 !== 0 ? 'border-y' : 'border-none'}`}>
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

export default Followingsec;
