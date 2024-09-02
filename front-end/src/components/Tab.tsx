import { ReactNode} from "react";


type TabProps = {
    id: string
    arrOfTab: {
        name: string,
        content: ReactNode | null,
        child?: {
            name: string,
            content: ReactNode | null
        }[]
    }[]
    parentClass: string
    currentTab: string
    childrenTabs?: string
};

type Eachtabprops = {
    item: {
        name: string,
        content: ReactNode | null,
        child?: {
            name: string,
            content: ReactNode | null,
        }[]
    }
    parentClass: string
    currentTab: string
    childrenTabs?: string
};

const EatchTab = ({ item, parentClass, childrenTabs }: Eachtabprops) => {
    
    return <div>
        {
           ( item.child &&
            item.child.length )?
            <Tab
                arrOfTab={item.child}
                id={item.name}
                parentClass={parentClass}
                currentTab={childrenTabs || ''}
            />:
           item.content
        }
       
    </div>
};

const Tab = ({ id = 'tab', arrOfTab, parentClass, currentTab, childrenTabs}: TabProps) => {

    return <div id={id} className={parentClass}>
        {
            arrOfTab &&
                arrOfTab.length ?
                arrOfTab.map(item =>
                    (item.name.trim().toLocaleLowerCase() === currentTab.trim().toLocaleLowerCase()) &&
                    <EatchTab
                        item={item}
                        key={item.name}
                        currentTab={currentTab}
                        parentClass={parentClass}
                        childrenTabs={childrenTabs}
                    />
                ) :
                null
        }
    </div>
};

export default Tab;
