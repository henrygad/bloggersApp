import { useAppSelector } from "../redux/slices";
import { Singlenotification } from "../components";
import { Notificationsprops } from "../entities";

const Notification = () => {
  const { userProfile: { data: profileData, loading: loadingProfile } } = useAppSelector((state) => state.userProfileSlices);

  const handleDisplayNotifications = (arr: Notificationsprops[]) => {
    return arr.reduce((acc: Notificationsprops[], curr: Notificationsprops) => {
      const preValue = acc?.[acc.length - 1]

      if (
        ( curr.typeOfNotification === 'blogpostLike' ||
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
    <div id="notification-header" className="flex gap-x-2">
      <span className="font-bold text-base">Notifications</span>
    </div>
    <div className="flex justify-center mt-10">
      {!loadingProfile ?
        <>
          {profileData &&
            profileData.notifications &&
            profileData.notifications.length ?
            <div className="space-y-3">
              {handleDisplayNotifications(profileData.notifications?.map(item => item).reverse()).map((item) => {
                if (item.typeOfNotification === 'view') {
                  return <Singlenotification key={item._id} notification={item} displayImage={false} />
                } else if (item.typeOfNotification === 'share') {
                  return <Singlenotification key={item._id} notification={item} displayImage={false} />
                }

                return <Singlenotification key={item._id} notification={item} displayImage={true} />
              }
              )}
            </div> :
            <div>no notifications</div>}
        </> :
        <div>loading notifications...</div>
      }
    </div>
  </div>
};

export default Notification;
