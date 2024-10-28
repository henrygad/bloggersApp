import { Button, SingleImage } from "../components";
import { Imageprops } from "../entities";

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


  return <div id="profile-advater">
    {
      !profileAvatersLoading ?
        <>{
          profileAvatersData &&
            profileAvatersData.length ?
            <>{
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 " >
                {profileAvatersData.map((item, index) =>
                  <SingleImage
                    key={item._id || index}
                    image={item}
                    index={index}
                    placeHolder=""
                  />
                )}
              </div>
            }
              {numberOfAvaters !== profileAvatersData.length ?
                <Button
                  id="load-more-advater"
                  children={!moreAvatersLoading ? 'load more' : 'loading...'}
                  buttonClass=" "
                  handleClick={handleServerLoadMoreAvaters}
                /> :
                null
              }
            </> :
            <div>no advater</div>
        }</> :
        <div>advater loading...</div>
    }
  </div>
};

export default Avatersec;
