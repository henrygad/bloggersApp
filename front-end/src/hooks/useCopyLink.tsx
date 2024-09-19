import { useState } from "react";

const useCopyLink = (url: string) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator
      .clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);

        setTimeout(()=> {
          setCopied(false);
        }, 1000)
      })
      .catch(() => setCopied(false));
  };

  return { handleCopyLink, copied };
}

export default useCopyLink;
