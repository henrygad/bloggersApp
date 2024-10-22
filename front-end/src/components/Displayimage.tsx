import { useState } from 'react';

type Props = {
    id: string
    imageUrl: string
    onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
    parentClass: string
    imageClass: string
    placeHolder: string
};

const Displayimage = ({
    id,
    imageUrl,
    parentClass,
    imageClass,
    placeHolder,
    onClick 
}: Props) => {
    const [imageLoading, setImageLoading] = useState(true);

    return <div className={`relative ${parentClass}`}>
        <img
            id={id}
            src={imageUrl}
            className={imageClass}
            style={{ width: '100%', height: '100%' }}
            onError={(e) => {
                if (e.target instanceof HTMLImageElement) {
                    e.target.src = placeHolder;
                };
            }}
            onLoadStart={(e) => {
                setImageLoading(true)
            }}
            onLoad={(e) => {
                setImageLoading(false)
            }}
            onClick={onClick}
        />
        {imageLoading ?
            <span
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
                <svg className="animate-spin h-5 w-5 mr-3 rounded-e-full border-black border-2 " viewBox="0 0 24 24">
                </svg>
            </span> :
            null
        }
    </div>
};

export default Displayimage
