import { useEffect, useRef, useState } from "react";
import { Closedeye, Openeye } from "./Icons";

type Props = {
    id: string
    type: string
    inputName?: string
    value: string | number | readonly string[] | undefined
    setValue: (value: string | number | Date | undefined) => void
    inputClass?: string
    labelClass?: string
    placeHolder?: string
    callBack?: (target: HTMLInputElement | null) => void
    error?: {
        isTrue: boolean
        errorMsg: string
        errorClass?: string
    }
    checked?: boolean
    onClick?: () => void
};

const Input = ({
    id,
    type,
    inputName = '',
    value,
    setValue,
    inputClass = '',
    labelClass = '',
    error = {
        isTrue: false,
        errorMsg: '',
        errorClass: '',
    },
    placeHolder = '',
    callBack = () => null,
    checked = false,
    onClick = () => null,
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

    return <label htmlFor={id} className={` ${labelClass}`}>
        {inputName}
        <span className="relative block">
            <input
                id={id}
                placeholder={placeHolder}
                name={inputName}
                className={` ${error.isTrue && 'border border-red-800'} ${inputClass}`}
                type={type === 'password' ?
                    (!passWordIsVisible ? 'password' : 'text') :
                    (type || 'text')
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                ref={inputRef}
                checked={checked}
                onClick={onClick}
                autoComplete="off"
            />
            {type === 'password' &&
                <span
                    className="flex justify-center items-center absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10"
                    onClick={() => setPassWordVisibility(!passWordIsVisible)}>
                    {passWordIsVisible ?
                        <Closedeye height="20px" width="20px" /> :
                        <Openeye height="20px" width="20px" />
                    }
                </span>
            }
        </span>
        <span className={error.errorClass}>
            {error.isTrue &&
                error.errorMsg.trim() ?
                <p className='text-red-800 text-[.85rem] text-wrap first-letter:capitalize px-1  '>
                    {error.errorMsg}
                </p> :
                null
            }
        </span>
    </label>
}

export default Input
