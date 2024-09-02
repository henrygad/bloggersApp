import { Addphotoicon } from "./Icons";

type Props = {
    name?: string
    id: string
    height?: string
    width?: string
    placeHolder?: string 
    setValue: (value: FileList | null) => void
};
const Fileinput = ({ setValue, name, height, width, id, placeHolder }: Props) => {

    return <label className='text-base' htmlFor={id}>
        {name}
        <div className='relative'>
            <div id="filePlaceHolder">
                {placeHolder ? placeHolder : <Addphotoicon height={height || ''} width={width ||''} />}
            </div>
            <input
                id={id}
                type="file"
                name={name || 'file'}
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => setValue(e.target.files)}
                className="absolute top-0 right-0 left-0 bottom-0 opacity-0 cursor-pointer"
            />
        </div>
    </label>
};

export default Fileinput;
