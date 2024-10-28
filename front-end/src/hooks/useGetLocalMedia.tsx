type Props = {
    files: FileList | null
    fileType: string
    getValue: ({ data, url, file }: { data: string | ArrayBuffer, url: string, file: Blob }) => void
};

const useGetLocalMedia = () => {

    const getMedia = ({ files, fileType, getValue }: Props) => {
        if (!files) return;
        let file: Blob = files[0];

        const promise = new Promise((resolve: (value: string | ArrayBuffer) => void, reject: (value: string) => void) => {
            if (file) {
                const readFile = new FileReader();
                readFile.readAsDataURL(file); // read the file data in a base64-encoded string that represents the file data
                //const imageUrl = URL.createObjectURL(file); // creata a url for a file
                //readFile.readAsArrayBuffer(file); // read the file as Blob in a binary format
                //const fileBlob = new Blob([file], {type: file.type}); // create the file into a binary format which can be uploader to the server

                readFile.onload = function (e) {
                    if (e.target?.result) {
                        resolve(e.target.result);
                    } else {
                        reject('file data not found');
                    };
                };
            } else {
                reject('file data not found');
            };

        });

        promise
            .then((data) => {
                if (fileType === 'image') getValue({  data, url: URL.createObjectURL(file), file });
                else if (fileType === 'video') getValue({ data, url: URL.createObjectURL(file), file });
            })
            .catch((error) => console.error(error));
    };

    return getMedia;
};

export default useGetLocalMedia;
