import { Singleuser } from "../components";
import { useUserIsLogin } from "../hooks";


const Followingsec = ({ arrOfFollowing }: { arrOfFollowing: string[] }) => {
     
    return <div className="space-y-3">
        <span >Following {arrOfFollowing && arrOfFollowing.length ? arrOfFollowing.length : 0}</span>

        {arrOfFollowing &&
            arrOfFollowing.length ?
            <>
                {
                    arrOfFollowing.map((item, index) =>
                        <Singleuser userName={item} index={index} />
                    )
                }</> :
            <div>no followers </div>}
    </div>
};

export default Followingsec;
