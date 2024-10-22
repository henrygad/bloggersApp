import { RiVideoAddLine, RiImageAddLine } from "react-icons/ri";

type Props = {
    id: string
    type: string
    name?: string
    height?: string
    width?: string
    accept: string
    placeHolder?: string
    setValue: (value: FileList | null) => void
};
const Fileinput = ({ id, type, name, setValue, height, width, accept, placeHolder }: Props) => {

    const Showfileicon = () => {
        if (type === 'video') {
            return <RiVideoAddLine size={30} />
        };

        return <RiImageAddLine size={30}/>;
    };

    return <label className='text-base' htmlFor={id}>
        {name}
        <span className='relative'>
            <span id="file-placeHolder" className="cursor-pointer">
                {placeHolder ?
                    placeHolder :
                    <Showfileicon />
                }
            </span>
            <input
                id={id}
                type="file"
                name={name || 'file'}
                accept={accept}
                onChange={(e) => setValue(e.target.files)}
                className="absolute top-0 right-0 left-0 bottom-0 opacity-0 cursor-pointer -z-10"
            />
        </span>
    </label>
};

export default Fileinput;
