import { Singleuser } from "../components";

const Followingsec = ({ arrOfFollowing }: { arrOfFollowing: string[] }) => {

    return <div className="space-y-3">
        {arrOfFollowing &&
            arrOfFollowing.length ?
            <>
                {
                    arrOfFollowing.map((item, index) =>
                        <Singleuser key={item} userName={item} index={index} />
                    )
                }</> :
            null
            }
    </div>
};

export default Followingsec;
