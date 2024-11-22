
const useConvertRawDate = () => {
    //"2024-11-20T12:00:00.000Z"
    const handleReadableDate = (rawDate: Date | string) => {
        const readableDate = new Date(rawDate)
            .toLocaleString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                /* second: '2-digit', */
               /*  timeZoneName: 'short' */
            });

        return readableDate;
    };

    return handleReadableDate;
};

export default useConvertRawDate;
