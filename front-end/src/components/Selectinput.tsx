import { useRef, useState } from 'react'
import { useClickOutSide } from '../hooks';

type Props = {
    arrOfList: (string)[]
    id: string
    selectedValue: string
    setSeletedValue: (value: string) => void
    defaultValueClass?: string,
    parentClass: string
    name: string
    animation: boolean
};

const Selectinput = ({
    arrOfList = [],
    id = 'selection',
    selectedValue,
    setSeletedValue,
    defaultValueClass = '',
    parentClass,
    name,
    animation = true,
}: Props) => {
    const [openDropDownMenu, setOpenDropDownMenu] = useState(false);
    const selectWrapperRef = useRef(null);
    useClickOutSide(selectWrapperRef, () => setOpenDropDownMenu(false));

    return <label ref={selectWrapperRef} htmlFor={id} className={`block relative ${parentClass} `}>
        {name}
        <span
            className={`block first-letter:capitalize ${defaultValueClass} 
            border rounded-md cursor-pointer`}
            onClick={() => setOpenDropDownMenu(!openDropDownMenu)}
        >
            {selectedValue}
        </span>
        <div id={id}
            className={`w-full ${openDropDownMenu ? 'block' : 'hidden'}
         absolute border shadow-sm p-2 bg-white rounded-md z-50`}
        >
            {arrOfList &&
                arrOfList.length &&
                arrOfList.map((item, index) =>
                    <span id={item}
                        key={item}
                        className={`block text-start w-full first-letter:capitalize
                           ${animation ? 
                            `hover:text-white hover:bg-green-200 transition-colors ${selectedValue?.trim().toLocaleLowerCase() === item?.trim().toLocaleLowerCase() ?
                                    'bg-green-400' :
                                    ' '}  ` :
                                ''
                            }    
                            ${index === (arrOfList.length - 1) ? "" : "border-b"} 
                            p-1 rounded-md `
                        }
                        onClick={() => setSeletedValue(item)}
                    >
                        {item}
                    </span>
                )
            }
        </div>
    </label>
};

export default Selectinput;