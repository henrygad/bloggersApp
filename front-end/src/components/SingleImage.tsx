import { Advaterprops } from "../entities";
import Displayimage from "./Displayimage"
import Imageplaceholder from "../assert/imageplaceholder.png";
import Dotnav from "./Dotnav";
import Menu from "./Menu";
import { useState } from "react";
import { useDeleteData, useUserIsLogin } from "../hooks";
import Dialog from "./Dialog";
import Button from "./Button";
import { useAppDispatch } from "../redux/slices";
import { deleteAdvaters } from "../redux/slices/userAdvaters";

type Props = {
    image: Advaterprops,
    index: number,
    placeHolder?: string
};

const SingleImage = ({ image: { _id, uploader }, index, placeHolder = Imageplaceholder }: Props) => {
    const { loginStatus: { loginUserName } } = useUserIsLogin();

    const isAccountOwner = uploader === loginUserName;

    const [toggleAdvaterSideNav, setToggleAdvaterSideNav] = useState(' ');
    const [imageDialog, setDialog] = useState('');

    const {deleteData, loading: LoadingDelete, error: errorDelete}  = useDeleteData();
    const appDispatch = useAppDispatch();

    const generalAdvaterNavChildren = [
        {
            name: 'view',
            to: '',
            content: <Button
                children={'View'}
                buttonClass=" border-b"
                handleClick={() => handleViewExpandImageIsize()}
            />
        },
        {
            name: 'share',
            to: '',
            content: <Button
                children={'Share'}
                buttonClass=" border-b"
                handleClick={() => handleShareImage()}
            />
        },
    ];

    const OwnerAdvaterNavChildren = [
        ...generalAdvaterNavChildren,
        {
            name: 'delete',
            to: '',
            content: <Button
                children={!LoadingDelete ? 'Delete' : 'loading...'}
                buttonClass=" border-b"
                handleClick={() => handleDeleteImage(_id)}
            />
        },
    ];

    const handleViewExpandImageIsize = () => {
        setDialog(_id);
    };

    const handleShareImage = () => { };

    const handleDeleteImage = async(_id: string) => { 
        const response = await deleteData('/api/deleteimage/'+_id);
        const { ok}= response;
        if(ok){
            appDispatch(deleteAdvaters(_id));
        };
    };

    return <div className="relative w-[240px] h-[240px] bg-gray-100 rounded-md">
        <Displayimage
            id={'avater' + index}
            imageUrl={"/api/image/" + _id}
            parentClass='w-full h-full cursor-pointer'
            imageClass='object-cover'
            onClick={handleViewExpandImageIsize}
            placeHolder={placeHolder.trim() !== '' ? placeHolder : ''}
        />
        <Dotnav
            setToggleSideMenu={setToggleAdvaterSideNav}
            toggleSideMenu={toggleAdvaterSideNav}
            name={'advaterNav' + _id}
            id={'advater-nav'}
            children={<Menu
                arrOfMenu={!isAccountOwner ? generalAdvaterNavChildren : OwnerAdvaterNavChildren}
                parentClass="flex-col gap-2 absolute top-0 right-0 min-w-[120px] max-w-[120px] backdrop-blur-sm p-3 rounded shadow-sm z-20 cursor-pointer"
                childClass=''
                id='avaterMenus'
            />}
        />
        <div id="image-dialog" >
            <Dialog
                id='image-dialog-wrapper'
                parentClass='p-4'
                childClass='flex justify-center items-center relative w-full h-full'
                currentDialog={_id}
                children={
                    <>
                        <div className="absolute -top-1 -left-1 z-50">
                            <Button
                                children={'Go back'}
                                buttonClass=""
                                handleClick={() => setDialog(' ')}
                            />
                        </div>
                        <Displayimage
                            id={'avater' + index}
                            imageUrl={"/api/image/" + _id}
                            parentClass='w-full h-full'
                            imageClass='object-contain'
                            placeHolder={placeHolder.trim() !== '' ? placeHolder : ''}
                        />
                    </>
                }
                dialog={imageDialog}
                setDialog={setDialog}
            />
        </div>
    </div>
};

export default SingleImage;
