import { useAppSelector } from "../redux/slices";
import { Backwardnav, Singlenotification } from "../components";
import { Notificationsprops } from "../entities";


const Notification = () => {
  const { userProfile: { data: profileData, loading: loadingProfile } } = useAppSelector((state) => state.userProfileSlices);

  const handleDisplayNotifications = (arr: Notificationsprops[]) => {
    return arr.reduce((acc: Notificationsprops[], curr: Notificationsprops) => {
      const preValue = acc?.[acc.length - 1]

      if (
        (curr.typeOfNotification === 'blogpostLike' ||
          curr.typeOfNotification === 'commentLike' ||
          curr.typeOfNotification === 'blogpostComment' ||
          curr.typeOfNotification === 'replyComment' ||
          curr.typeOfNotification === 'follow' ||
          curr.typeOfNotification === 'unfollow'
        ) &&
        (preValue?.typeOfNotification === curr.typeOfNotification && preValue?.msg === curr.msg)
      ) {
        const prePegs = preValue.pegs || [];
        acc[acc.length - 1] = { ...preValue, pegs: [...prePegs, curr] };

      } else {
        acc.push(curr);
      };

      return acc;
    }, [])
  };


  return <div>
    <Backwardnav pageName="Notifications" />
    <div className="w-full space-y-2">
      {!loadingProfile ?
        <>
          {profileData &&
            profileData.notifications &&
            profileData.notifications.length ?
            <>
              {handleDisplayNotifications(profileData.notifications?.map(item => item).reverse())
                .map((item) => {
                  if (item.typeOfNotification === 'view') {
                    return <Singlenotification key={item._id} notification={item} displayImage={false} />
                  }

                  return <Singlenotification key={item._id} notification={item} displayImage={true} />
                }
                )}
            </> :
            null
          }
        </> :
        <div>loading notifications...</div>
      }
    </div>
  </div>
};

export default Notification;
