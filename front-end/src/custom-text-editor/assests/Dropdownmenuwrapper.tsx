import { ReactElement} from 'react'

const Dropdownmenuwrapper = ({ menuName, Children , openDropDownMenu = ''}: { Children: ReactElement, menuName: string, openDropDownMenu: string }) => {
    return <div className='relative w-full'>
        <div id={menuName} className={` ${openDropDownMenu.toLocaleLowerCase() === menuName.toLocaleLowerCase() ? 'block' : 'hidden'}
         absolute top-0 bg-white border shadow-md p-2 z-50`}>
            {Children}
        </div>
    </div>
};
export default Dropdownmenuwrapper;