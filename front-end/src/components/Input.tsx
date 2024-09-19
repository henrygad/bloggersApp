import { useEffect, useRef, useState } from "react";
import { Closedeye, Openeye } from "./Icons";

type Props = {
    type: string
    inputName: string
    value: string | number | readonly string[] | undefined
    setValue: (value: string | number | Date | undefined) => void
    inputClass: string
    labelClass: string
    placeHolder?: string
    callBack?: (target: HTMLInputElement | null) => void
    error: {
        isTrue: boolean
        errorMsg: string
        errorClass: string
    }
};

const Input = ({
    type,
    inputName,
    value,
    setValue,
    inputClass,
    labelClass,
    error,
    placeHolder = '',
    callBack = () => null,
}: Props) => {
    const [passWordIsVisible, setPassWordVisibility] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
            <input
                className={` ${error.isTrue && 'border border-red-800'} ${inputClass}`}
                type={type === 'password' ?
                    (!passWordIsVisible ? 'password' : 'text') :
                    (type || 'text')
                }
                placeholder={placeHolder}
                name={inputName}
                id={inputName}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                ref={inputRef}
            />
            {type === 'password' &&
                <span
                    className="flex justify-center items-center absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10"
                    onClick={() => setPassWordVisibility(!passWordIsVisible)}>
                    {passWordIsVisible ?
                        <Closedeye height="20px" width="20px" />:
                        <Openeye height="20px" width="20px" />
                    }
                </span>
            }
        </span>
        <span className={error.errorClass}>
            {error.isTrue &&
                <p className='text-red-800 text-sm text-wrap'>{error.errorMsg}</p>
            }
        </span>
    </label>
}

export default Input
