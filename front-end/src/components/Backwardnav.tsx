import { useNavigate } from 'react-router-dom';
import Button from './Button'
import { IoMdArrowRoundBack } from 'react-icons/io'

const Backwardnav = ({ pageName }: { pageName: string }) => {
    const navigate = useNavigate();

    const handleNavigateBack = () => {
        navigate(-1);
    };

    return <div className="flex items-center gap-4 mb-4">
        <Button
            id="Backward-navigation-brn"
            buttonClass='flex gap-4'
            children={<IoMdArrowRoundBack size={20} />}
            handleClick={handleNavigateBack} />
        <span className="text-xl font-secondary font-bold capitalize">
            {pageName}
        </span>
    </div>
}

export default Backwardnav;
