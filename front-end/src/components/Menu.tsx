import {  ReactNode, useState } from "react";
import { Link } from "react-router-dom";


type Menuprops = {
  arrOfMenu: {
    name: string
    to?: string
    content?: ReactNode | null
    child?: {
      name: string
      to?: string
      content?: ReactNode | null
    }[]
  }[]
  parentClass: string
  childClass: string
  id?: string
  nestedChildParentClass?: string
};

type Listprops = {
  item: {
    name: string;
    to?: string;
    content?: ReactNode | null;
    child?: {
      name: string;
      to?: string;
      content?: ReactNode | null;
    }[];
  },
  parentClass: string
  childClass: string
  nestedChildParentClass?: string
};

type Toggledropdownnavprops = {
  displayParentNav: null
  setDisplayParentNav: (value: null) => void
  name: string
};

const Toggledropdownnav = ({ name, displayParentNav, setDisplayParentNav }: Toggledropdownnavprops) => {

  const handleToggleParentNav = (getParentName: string) => {
    setDisplayParentNav(
      {
        ...displayParentNav,
        [getParentName]: !(displayParentNav && displayParentNav[getParentName])
      }
    );
  };

  return <span
    className=" text-xl font-bold cursor-pointer "
    onClick={() => handleToggleParentNav(name)}
  >
    {
      displayParentNav &&
        displayParentNav[name] ? "-" : "+"
    }
  </span>

};

const List = ({ childClass, parentClass, item, nestedChildParentClass }: Listprops) => {
  const [displayParentNav, setDisplayParentNav] = useState(null);
  if (!item) return;

  return <li id={item.name}
    className={childClass}
  >
    {item.to ?
      <Link to={item.to}>
        {item.name}
        {item.child &&
          item.child.length ?
          <Toggledropdownnav
            name={item.name}
            displayParentNav={displayParentNav}
            setDisplayParentNav={setDisplayParentNav}
          /> :
          null
        }
      </Link> :
      <span className=" block">
        {item.content}
        {item.child &&
          item.child.length ?
          <Toggledropdownnav
            name={item.name}
            displayParentNav={displayParentNav}
            setDisplayParentNav={setDisplayParentNav}
          /> :
          null
        }
      </span> 
    }

    {(item.child &&
      item.child.length) &&
      (displayParentNav &&
        displayParentNav[item.name]) ?
      <Menu
        arrOfMenu={item.child}
        parentClass={nestedChildParentClass || ''}
        childClass={childClass}
        id={item.name}
      /> :
      null
    }

  </li>
};

const Menu = ({ arrOfMenu, parentClass, childClass, id = "menu", nestedChildParentClass }: Menuprops) => {

  return <ul id={id}
    className={parentClass}
  >
    {arrOfMenu &&
      arrOfMenu.length ?
      arrOfMenu.map((item) =>
        <List
          key={item.name}
          item={item}
          parentClass={parentClass}
          childClass={childClass}
          nestedChildParentClass={nestedChildParentClass}
        />
      ) :
      null
    }
  </ul>
}

export default Menu
