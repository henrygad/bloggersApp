type Props = {
    files: FileList | null
    fileType: string
    getValue: ({url, file}: {url: string | ArrayBuffer, file: Blob}) => void
};

const useGetLocalMedia = () => {

    const getMedia = ({ files, fileType, getValue }: Props) => {
        if (!files) return;
        let file: Blob = files[0];

        const promise = new Promise((resolve: (value: string | ArrayBuffer) => void, reject: (value: string) => void) => {
            if (file) {
                const readFile = new FileReader();
                readFile.readAsDataURL(file); // To read the file data in a base64-encoded string that represents the file data
                //const imageUrl = URL.createObjectURL(file); // To creata a url for a file
                //readFile.readAsArrayBuffer(file); // To read the file as Blob i a binary format

                readFile.onload = function (e) {
                    if (e.target?.result) {
                        resolve(e.target.result);
                        //const fileBlob = new Blob([e.target.result], {type: file.type}); // To create the file into a binary format which can be uploader to the server
                    } else {
                        reject('No url data found');
                    };
                };
            } else {
                reject('No file found');
            };

        })

        promise
            .then((value) => {
                if (fileType === 'image') getValue({ url: value, file });
                else if (fileType === 'video') getValue({url: URL.createObjectURL(file), file});
            })
            .catch((error) => console.error(error));
    };

    return getMedia;
};

export default useGetLocalMedia
