import { Imageprops } from "../entities";
import usePostData from "./usePostData";



const me = (): string | number => {
    return 'ff'
}

const useCreateImage = () => {
    const { postData, loading, error } = usePostData();

    const createImage = async ({ file, fieldname, url }: { file: Blob, fieldname: string, url: string }): Promise<Imageprops | null> => {
        const formData = new FormData();
        formData.append(fieldname, file);

        const response = await postData<Imageprops>(url, formData);
        const { data, ok } = response;

        if (data) {
            return data;
        } else {
            return null;
        };
    };

    return { createImage, loading, error };
};

export default useCreateImage
