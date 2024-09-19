import { useState } from "react";
import { Button, SingleImage } from "../components";
import { Advaterprops } from "../entities";

type Props = {
  profileAdvatersData: Advaterprops[]
  profileAdvatersLoading: boolean
  profileAdvatersError: string,
  handleServerLoadMoreAdvaters: () => void
  moreAdvatersLoading: boolean
  moreAdvatersError: string
};

const Advatersec = ({
  profileAdvatersData,
  profileAdvatersLoading,
  profileAdvatersError,
  handleServerLoadMoreAdvaters,
  moreAdvatersLoading,
  moreAdvatersError,
}: Props) => {


  return <div id="profile-advater">
    {
      !profileAdvatersLoading ?
        <>{
          profileAdvatersData &&
            profileAdvatersData.length ?
            <>{
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 " >
                {profileAdvatersData.map((item, index) =>
                  <SingleImage
                    key={item._id || index}
                    image={item}
                    index={index}
                    placeHolder=""
                  />
                )}
              </div>
            }
              <Button
                id="load-more-advater"
                children={!moreAdvatersLoading ? 'load more' : 'loading...'}
                buttonClass=" "
                handleClick={handleServerLoadMoreAdvaters}
              />
            </> :
            <div>no advater</div>
        }</> :
        <div>advater loading...</div>
    }
  </div>
};

export default Advatersec;
