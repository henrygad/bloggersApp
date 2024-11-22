import usePatchData from "./usePatchData";

const useNotification = () => {
    const { patchData } = usePatchData();

    const notify = async (url: string, body: {
        typeOfNotification: string
        msg: string
        url: string
        notifyFrom: string
    }) => {
        
        await patchData(url, body);
    };

    return notify;
};

export default useNotification;
