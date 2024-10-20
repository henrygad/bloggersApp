import { Addphotoicon } from "./Icons";

type Props = {
    name?: string
    id: string
    height?: string
    width?: string
    accept: string
    placeHolder?: string
    setValue: (value: FileList | null) => void
};
const Fileinput = ({ id, name, setValue, height, width, accept, placeHolder }: Props) => {

    return <label className='text-base' htmlFor={id}>
        {name}
        <span className='relative'>
            <span id="file-placeHolder">
                {placeHolder ?
                    placeHolder :
                    <Addphotoicon height={height || ''}
                        width={width || ''} />
                }
            </span>
            <input
                id={id}
                type="file"
                name={name || 'file'}
                accept={accept}
                onChange={(e) => setValue(e.target.files)}
                className="absolute top-0 right-0 left-0 bottom-0 opacity-0 cursor-pointer"
            />
        </span>
    </label>
};

export default Fileinput;
