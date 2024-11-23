import { useEffect } from "react";
import { LandLoading, SingleImage } from "../components";
import { Imageprops } from "../entities";
import { useScrollPercent } from "../hooks";

type Props = {
  profileAvatersData: Imageprops[]
  profileAvatersLoading: boolean
  profileAvatersError: string,
  handleServerLoadMoreAvaters: () => void
  moreAvatersLoading: boolean
  moreAvatersError: string
  numberOfAvaters: number
};

const Avatersec = ({
  profileAvatersData,
  profileAvatersLoading,
  profileAvatersError,
  handleServerLoadMoreAvaters,
  moreAvatersLoading,
  moreAvatersError,
  numberOfAvaters,
}: Props) => {

  const { scrollPercent } = useScrollPercent();

  const handleAutoLoadMoreAvater = ()=>{

    if(numberOfAvaters !== profileAvatersData.length){
      handleServerLoadMoreAvaters();
    };

  };

  useEffect(() => {
    handleAutoLoadMoreAvater();
  }, [scrollPercent]);

  return <div id="profile-advater">
    {
      !profileAvatersLoading ?
        <>{
          profileAvatersData &&
            profileAvatersData.length ?
            <>{
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2" >
                {profileAvatersData.map((item, index) =>
                  <SingleImage
                    key={item._id}
                    image={item}
                    index={index}
                    placeHolder=""
                  />
                )}
              </div>
            }
             <LandLoading loading={moreAvatersLoading} />
            </> :
           null
        }</> :
        <div>advater loading...</div>
    }
  </div>
};

export default Avatersec;
