import { useEffect, useRef, useState } from "react";

type Props = {
    inputName: string
    value: string
    setValue: (value: string ) => void
    inputClass: string
    labelClass: string
    placeHolder?: string
    callBack?: (target: HTMLTextAreaElement | null) => void
    error: {
        isTrue: boolean
        errorMsg: string
        errorClass: string
    };
};

const Texarea = ({
    inputName,
    value,
    setValue,
    inputClass,
    labelClass,
    error,
    placeHolder = '',
    callBack = ()=> null,
}: Props) => {
    const [passWordIsVisible, setPassWordVisibility] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleOnInputField = () => {
        callBack(inputRef.current)
    };

    useEffect(() => {
        if (!inputRef.current) return;

        inputRef.current.addEventListener('focus', handleOnInputField);
        return () => {
            inputRef.current?.removeEventListener('focus', handleOnInputField);
        };
    }, []);

    return <label htmlFor={inputName} className={` ${labelClass}`}>
        {inputName}
        <span className="relative block">
            <textarea
                className={` ${error.isTrue && 'border border-red-800'} ${inputClass}  rounded-sm`}
                placeholder={placeHolder}
                name={inputName}
                id={inputName}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                ref={inputRef}
            />
        </span>
        <span className={error.errorClass}>
            {error.isTrue &&
                <p className='text-red-800 text-sm text-wrap'>{error.errorMsg}</p>
            }
        </span>
    </label>
}

export default Texarea

