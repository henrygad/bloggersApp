import usePatchData from "./usePatchData";

const useNotification = () => {
    const { patchData } = usePatchData();

    const notify = async (url: string, body: {
        typeOfNotification: string
        msg: string
        url: string
        notifyFrom: string
    }) => {
        
        const response = await patchData(url, body);
        const { data, ok } = response;
        if (ok) {
            console.log(data);
        };
    };

    return notify;
};

export default useNotification;
