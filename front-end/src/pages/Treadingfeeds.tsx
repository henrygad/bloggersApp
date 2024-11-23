import { Blogpostprops } from "../entities";
import Landingpage from "./Landingpage";

type Props = {
  treadingFeedsData: Blogpostprops[]
  treadingFeedsLoading: boolean
  treadingFeedsError: string
};

const Treadingfeeds = ({
  treadingFeedsData,
  treadingFeedsLoading,
  treadingFeedsError,
}: Props) => {


  return <Landingpage
    treadingFeedsData={treadingFeedsData}
    treadingFeedsLoading={treadingFeedsLoading}
    treadingFeedsError={treadingFeedsError}
  />
};

export default Treadingfeeds;
