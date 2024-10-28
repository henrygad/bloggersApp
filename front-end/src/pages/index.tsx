import { lazy } from "react";
import Pageloading from "./Pageloading";
const Feed = lazy(()=> import('./Feed'));
const Contact = lazy(()=> import('./Contact'));
const Searchresult = lazy(()=> import('./Searchresult'));
const Profile = lazy(()=> import('./Profile'));
const Editeprofile = lazy(()=> import('./Editeprofile'));
const Post = lazy(()=> import('./Post'));
const Singleblogpostpage = lazy(()=> import('./Singleblogpostpage'));
const Settings = lazy(()=> import('./Settings'));
const Page404 = lazy(()=> import('./Page404'));
const Landingpage = lazy(()=> import('./Landingpage'));
const Notification = lazy(()=> import('./Notification'));
const Treadingfeeds = lazy(()=> import('./Treadingfeeds'));
const Saves = lazy(()=> import('./Saves'));

export {
  Saves,
  Treadingfeeds,
  Feed,
  Contact,
  Searchresult,
  Profile,
  Editeprofile,
  Post,
  Singleblogpostpage,
  Settings,
  Page404,
  Landingpage,
  Notification,
  Pageloading,
};