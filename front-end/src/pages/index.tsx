import { lazy } from "react";
import Pageloading from "./Pageloading";
const Feed = lazy(()=> import('./Feed'));
const About = lazy(()=> import('./About'));
const Contact = lazy(()=> import('./Contact'));
const Search = lazy(()=> import('./Search'));
const Profile = lazy(()=> import('./Profile'));
const Editeprofile = lazy(()=> import('./Editeprofile'));
const Post = lazy(()=> import('./Post'));
const Singleblogpostpage = lazy(()=> import('./Singleblogpostpage'));
const Settings = lazy(()=> import('./Settings'));
const Page404 = lazy(()=> import('./Page404'));
const Landingpage = lazy(()=> import('./Landingpage'));
const Notification = lazy(()=> import('./Notification'));
const Directmessage = lazy(()=> import('./Directmessage'));

export {
  Feed,
  About,
  Contact,
  Search,
  Profile,
  Editeprofile,
  Post,
  Singleblogpostpage,
  Settings,
  Page404,
  Landingpage,
  Notification,
  Directmessage,
  Pageloading,
};