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
    tabClass: string
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
    tabClass: string
    currentTab: string
    childrenTabs?: string
};

const EatchTab = ({ item, tabClass, childrenTabs }: Eachtabprops) => {
    
    return <>
        {
           ( item.child &&
            item.child.length )?
            <Tab
                arrOfTab={item.child}
                id={item.name}
                tabClass={tabClass}
                currentTab={childrenTabs || ''}
            />:
           item.content
        }
       
    </>
};

const Tab = ({ id = 'tab', arrOfTab, tabClass, currentTab, childrenTabs}: TabProps) => {

    return <div id={id} className={tabClass}>
        {
            arrOfTab &&
                arrOfTab.length ?
                arrOfTab.map(item =>
                    (item.name.trim().toLocaleLowerCase() === currentTab.trim().toLocaleLowerCase()) &&
                    <EatchTab
                        item={item}
                        key={item.name}
                        currentTab={currentTab}
                        tabClass={tabClass}
                        childrenTabs={childrenTabs}
                    />
                ) :
                null
        }
    </div>
};

export default Tab;
