import React, { ReactElement } from 'react'

type Props = {
    children: string | ReactElement | null
    buttonClass: string
    handleClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    id?: string

};

const Button = ({ children, buttonClass, id='', handleClick = (e) => null }: Props) => {

    return <button
        id={id}
        className={` ${buttonClass} text-[0.92rem] md:text-base cursor-pointer`}
        onClick={handleClick}
    >
        {children}
    </button>
};

export default Button;
