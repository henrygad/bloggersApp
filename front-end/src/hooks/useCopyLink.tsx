
const useCopyLink = (url: string | null | undefined = '') => {
    const handleCopyLink =()=>{
        navigator.clipboard.writeText(url || '')
        .then(()=>console.log('copied'))
        .catch((err)=> console.log(err))
     };

  return {copyLink: handleCopyLink};
}

export default useCopyLink;
