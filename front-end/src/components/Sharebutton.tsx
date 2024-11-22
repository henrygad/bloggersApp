import { useRef, useState } from "react";
import { useClickOutSide, useCopyLink, usePatchData, useUserIsLogin } from "../hooks";
import Button from "./Button";
import { LuShare2 } from "react-icons/lu"
import { BsCopy, BsInstagram } from "react-icons/bs"
import { FaCheck, FaWhatsapp } from "react-icons/fa"
import tw from "tailwind-styled-components";
import { CiFacebook } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";

/* 
import { BsCopy } from "react-icons/bs";
<BsCopy /> */

/* import { FaCheck } from "react-icons/fa";
<FaCheck /> */


type Props = {
    arrOfShares: string[]
    blogpostUrl: string
    apiForShare: string
    notificationUrl: string
    notificationTitle: string
}

const Sharebutton = ({ arrOfShares, blogpostUrl, apiForShare, notificationUrl, notificationTitle }: Props) => {
    const getBlogpostUrl = `https://localhost:5173/${blogpostUrl}`;
    const shareBtnRef = useRef(null);
    const { loginStatus: { sessionId } } = useUserIsLogin();
    const [shares, setShares] = useState(arrOfShares || []);
    const { patchData } = usePatchData();

    const [toggleShareOptions, setToggleShareOptions] = useState(false);

    useClickOutSide(shareBtnRef, () => { setToggleShareOptions(false) });

    const { handleCopyLink, copied } = useCopyLink(getBlogpostUrl);

    const handleCopyLinkTOClipBoard = () => {
        handleCopyLink();
        handleShare();
    };

    const handleShareToFacebook = () => {
        handleShare();
    };

    const handleShareToWhatsapp = () => {
        handleShare();
    };

    const handleShareToInstagram = () => {
        handleCopyLink();
        handleShare();
    };

    const handleShareToX = () => {
        handleShare();
    };

    const handleShare = async () => {
        if (sessionId) {
            if (shares.includes(sessionId)) return;
            const url = apiForShare;
            const body = null;

            patchData<{ share: string }>(url, body)
                .then((res) => {
                    const { data } = res;
                    console.log(data);
                    if (data) {
                        setShares(pre => [...pre, data.share]);
                    };
                });
        };
    };


    return <div ref={shareBtnRef} className="">
        <Button
            id="share-btn"
            buttonClass='flex gap-2'
            children={<>
                <LuShare2 size={20} />
                {shares?.length || 0}</>
            }
            handleClick={() => setToggleShareOptions(true)}
        />
        <Shareiconswrapper className={`${toggleShareOptions ? 'block' : 'hidden'} `}>
         <div className="flex flex-wrap justify-between gap-4 p-4">
            <Button
                id="copy-blogpost-link"
                buttonClass="flex justify-center items-center rounded-full h-16 w-16 border shadow"
                handleClick={() => handleCopyLinkTOClipBoard()}
                children={<>{copied ? <FaCheck color="green" size={22} /> : <BsCopy size={20} />}</>}
            />
            <Button
                id="share-to-facebook-btn"
                buttonClass="flex justify-center items-center rounded-full h-16 w-16 border shadow"
                children={
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${getBlogpostUrl}`} target="_blank">
                       <CiFacebook size={30} />
                    </a>
                }
                handleClick={() => handleShareToFacebook()}
            />
            <Button
                id="share-whatsappk-btn"
                buttonClass="flex justify-center items-center rounded-full h-16 w-16 border shadow"
                children={
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${notificationTitle}: ${getBlogpostUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FaWhatsapp size={26} />
                    </a>
                }
                handleClick={() => handleShareToWhatsapp()}
            />
            <Button
                id="share-to-instagram"
                buttonClass="flex justify-center items-center rounded-full h-16 w-16 border shadow"
                children={
                    <a href="https://www.instagram.com/" target="_blank">
                       <BsInstagram size={20} />
                    </a>
                }
                handleClick={() => handleShareToInstagram()}
            />
            <Button
                id="share-to-X"
                buttonClass="flex justify-center items-center rounded-full h-16 w-16 border shadow"
                children={
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${notificationTitle}&url=${getBlogpostUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer">
                      <FaXTwitter size={20}  />
                    </a>
                }
                handleClick={() => handleShareToX()}
            />
            </div>
        </Shareiconswrapper>
    </div>

};

export default Sharebutton;

const Shareiconswrapper = tw.div`
absolute 
left-0 
bottom-0 
right-0 
border 
rounded-md 
shadow
bg-white
dark:bg-stone-800 
dark:text-white
`
