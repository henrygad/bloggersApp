import { Imageprops } from "../entities";
import Displayimage from "./Displayimage"
import Imageplaceholder from "../assert/imageplaceholder.png";
import Dotnav from "./Dotnav";
import Menu from "./Menu";
import { useState } from "react";
import { useDeleteData, useUserIsLogin } from "../hooks";
import Dialog from "./Dialog";
import Button from "./Button";
import { useAppDispatch } from "../redux/slices";
import { decreaseTotalNumberOfUserAvaters, deleteAvaters, deleteBlogpostImages } from "../redux/slices/userImageSlices";
import { TfiFlagAlt2 } from "react-icons/tfi";
import { MdBlock, MdDeleteOutline } from "react-icons/md";
import { LuExternalLink } from "react-icons/lu";
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {
    image: Imageprops,
    index: number,
    placeHolder?: string
};

const SingleImage = ({ image: { _id, uploader, fieldname }, index, placeHolder = Imageplaceholder }: Props) => {
    const { loginStatus: { loginUserName } } = useUserIsLogin();

    const isAccountOwner = uploader === loginUserName;

    const [toggleAdvaterSideNav, setToggleAdvaterSideNav] = useState(' ');
    const [imageDialog, setDialog] = useState('');

    const { deleteData, loading: LoadingDelete, error: errorDelete } = useDeleteData();
    const appDispatch = useAppDispatch();

    const generalMenu = [
        {
            name: 'view',
            content: <Button
                id="see-all-of-blogpost-btn"
                buttonClass="flex gap-2"
                children={<><LuExternalLink size={20} />  View</>}
                handleClick={() => handleViewExpandImageIsize()}
            />
        },
    ];

    const intaracttionMenu = [
        ...generalMenu,
        {
            name: 'report',
            to: '',
            content: <Button
                id="report-content-btn"
                buttonClass="flex gap-2"
                children={<><TfiFlagAlt2 size={20} />  Report</>}
                handleClick={() => ''}
            />
        },
        {
            name: 'block',
            to: '',
            content: <Button
                id="report-content-btn"
                buttonClass="flex gap-2"
                children={<><MdBlock size={20} />  Block</>}
                handleClick={() => ''}
            />
        },
    ];

    const accountOnwerMenuForBlogpost = [
        ...generalMenu,
        {
            name: 'delete',
            to: '',
            content: <Button
                id="delete-image-avater"
                buttonClass="flex gap-2"
                children={<><MdDeleteOutline size={22} /> Delete </>}
                handleClick={() => handleDeleteImage(_id, fieldname)}
            />
        },
    ];

    const handleViewExpandImageIsize = () => {
        setDialog(_id);
    };

    const handleShareImage = () => { };

    const handleDeleteImage = async (_id: string, fieldname: string) => {
        const response = await deleteData('/api/deleteimage/' + _id);
        const { ok } = response;
        if (ok) {
            appDispatch(deleteAvaters({ _id }));
            appDispatch(deleteBlogpostImages({ _id }));
            if (fieldname == 'avater') appDispatch(decreaseTotalNumberOfUserAvaters(1));
        };
    };

    return <div className="relative w-[240px] h-[240px] bg-gray-100 rounded-md">
        <Displayimage
            id={'avater-image'}
            imageId={_id}
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
            children={
                <Menu
                    id='avaterMenus'
                    parentClass="absolute top-0 -right-2 min-w-[100px] max-w-[320px] backdrop-blur-sm p-3 rounded shadow-sm z-20 cursor-pointer space-y-4"
                    childClass=''
                    arrOfMenu={!isAccountOwner ?
                        intaracttionMenu :
                        accountOnwerMenuForBlogpost
                    }
                />}
        />
        <Dialog
            id='image-dialog-wrapper'
            parentClass=''
            childClass='container relative rounded-sm space-y-2 w-full h-full'
            currentDialog={_id}
            children={
                <>
                    <div className="absolute -top-1 -left-1 z-50">
                        <Button
                            id="authentication-dialog-close-btn"
                            buttonClass='absolute top-1 left-1'
                            children={<IoMdArrowRoundBack size={20} />}
                            handleClick={() => setDialog(' ')}
                        />                       
                    </div>
                    <Displayimage
                        id={'image' + index}
                        imageId={_id}
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
};

export default SingleImage;
