import { Singleuser } from "../components";

const Followerssec = ({ arrOfFollowers }: { arrOfFollowers: string[] }) => {
        
    return <div className="space-y-3">
        <span >Followers {arrOfFollowers && arrOfFollowers.length ? arrOfFollowers.length : 0}</span>
        {arrOfFollowers &&
            arrOfFollowers.length ?
            <>
                {
                    arrOfFollowers.map((item, index) =>
                        <Singleuser userName={item} index={index} />
                    )
                }</> :
            <div>no followers </div>}
    </div>
};

export default Followerssec;
