import { Singleuser } from "../components";

const Followerssec = ({ arrOfFollowers }: { arrOfFollowers: string[] }) => {
        
    return <div className="space-y-3">
        {arrOfFollowers &&
            arrOfFollowers.length ?
            <>
                {
                    arrOfFollowers.map((item, index) =>
                        <Singleuser key={item} userName={item} index={index} />
                    )
                }</> :
            null
            }
    </div>
};

export default Followerssec;
