import Button from "./Button";

type Props = {
    shares: string[]
    url: string
    notificationUrl: string
    notificationTitle: string
}

const Sharebutton = ({ shares, url, notificationUrl, notificationTitle }: Props) => {
    const handleShare = () => {
        console.log('shares');
    };

    return <Button
        id="share-btn"
        children={'Shares 2'}
        buttonClass=''
        handleClick={handleShare}
    />
};

export default Sharebutton;
