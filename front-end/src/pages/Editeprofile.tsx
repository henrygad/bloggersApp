import { useEffect, useState } from "react";
import { Button, Dialog, Displayimage, Fileinput, Input, Selectinput, Texarea } from "../components";
import { useCreateImage, useGetLocalMedia, useImageGalary, usePatchData } from "../hooks";
import { editProfile } from "../redux/slices/userProfileSlices";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { Imageprops, Userprops } from "../entities";
import { addAvaters, increaseTotalNumberOfUserAvaters } from "../redux/slices/userImageSlices";
import avaterPlaceholder from '../assert/avaterplaceholder.svg'
import { Advatersec } from "../sections";

const Editeprofile = () => {
    const { userProfile: {
        data: accountProfile,
        loading: accountProfileLoading,
        error: accountProfileError
    } } = useAppSelector((state) => state.userProfileSlices) // get user data

    const { userAvaters: {
        data: avaters,
        loading: loadingAvater,
        error: errorAvater
    } } = useAppSelector((state) => state.userImageSlices); // user profile avaters

    const [dateOfBirth, setDateOfBirth] = useState<Date | string>('');
    const [website, setWebsite] = useState('');
    const [country, setCountry] = useState('Nigeria');
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [sex, setSex] = useState('male');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState(' ');
    const [caretIsOn, setCaretIsOn] = useState('');
    const [viewImage, setViewImage] = useState(false);
    const [loadingDialog, setLoadingDialog] = useState('');
    const [toggleChangeProfileImage, setToggleChangeProfileImage] = useState('')
    const [imageChanged, setImageChange] = useState(false);
    const getMedia = useGetLocalMedia();
    const { patchData, loading, error } = usePatchData();

    const appDispatch = useAppDispatch();
    const { createImage, loading: loadingCreateImage, error: errorCreateImage } = useCreateImage();

    const { imageGalary, setImageGalary } = useImageGalary();

    const arrOfInputs = [
        {
            id: 'full-name-input',
            name: 'Full name',
            type: 'text',
            placeHolder: '',
            value: fullName,
            setValu: (value: string) => setFullName(value),
        },
        {
            id: 'date-of-birth-input',
            name: 'Date of birth',
            type: 'date',
            placeHolder: '',
            value: dateOfBirth,
            setValu: (value: Date) => setDateOfBirth(value),
        },
        {
            id: 'email-input',
            name: 'Email',
            type: 'email',
            placeHolder: 'example@gmail.com',
            value: email,
            setValu: (value: string) => setEmail(value),
        },
        {
            id: 'phone-number-input',
            name: 'phone number',
            type: 'phonenumber',
            placeHolder: '+234',
            value: phoneNumber,
            setValu: (value: string) => setPhoneNumber(value),
        },
        {
            id: 'website-input',
            name: 'Website',
            type: 'text',
            placeHolder: 'www.example.com',
            value: website,
            setValu: (value: string) => setWebsite(value),
        },
    ];

    const handleEditProfile = async () => {
        if (loading) return;
        const body = {
            displayImage: imageUrl,
            email,
            name: fullName,
            dateOfBirth,
            country,
            sex,
            website,
            bio,
            phoneNumber,
        };
        const url = '/api/editprofile';

        await patchData<Userprops>(url, body)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                appDispatch(editProfile(data));
                setImageChange(false);
                setCaretIsOn('');
            });
    };

    const handleSaveAllChanges = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleEditProfile();
    };

    const handleSaveSingleChanges = () => {
        handleEditProfile();
    };

    const handleCancle = (input: string) => {
        if (!accountProfile) return;
        const {
            displayImage, email, name, dateOfBirth, country, sex, website, bio, phoneNumber,
        } = accountProfile;

        if (input.toLocaleLowerCase()?.trim() === 'dateofbirth') setDateOfBirth(dateOfBirth);
        if (input.toLocaleLowerCase()?.trim() === 'image') setImageUrl(displayImage);
        if (input.toLocaleLowerCase()?.trim() === 'fullname') setFullName(name);
        if (input.toLocaleLowerCase()?.trim() === 'country') setCountry(country);
        if (input.toLocaleLowerCase()?.trim() === 'website') setWebsite(website);
        if (input.toLocaleLowerCase()?.trim() === 'bio') setBio(bio);
        if (input.toLocaleLowerCase()?.trim() === 'sex') setSex(sex);
        if (input.toLocaleLowerCase()?.trim() === 'phonenumber') setPhoneNumber(phoneNumber?.toString());
        if (input.toLocaleLowerCase()?.trim() === 'email') setEmail(email);

        setCaretIsOn('');
    };

    const handleDefaultStateValues = () => {
        if (!accountProfile) return;
        const {
            displayImage, email, name, dateOfBirth, country, sex, website, bio, phoneNumber,
        } = accountProfile;

        setDateOfBirth(dateOfBirth || '');
        setImageUrl(displayImage || '');
        setFullName(name || '');
        setCountry(country || '');
        setWebsite(website || '');
        setBio(bio || '');
        setSex(sex || '');
        setPhoneNumber(phoneNumber?.toString() || '');
        setEmail(email || '');
    };

    useEffect(() => {
        accountProfile && handleDefaultStateValues()
    }, [accountProfile]);

    return <div>
        {!accountProfileLoading ?
            <form
                action=""
                onSubmit={handleSaveAllChanges}
                className="font-text space-y-20"
            >
                <div className="w-full space-y-8 max-w-[480px]">
                    <div id="avater" className=" space-y-4">
                        <Displayimage
                            id="advater"
                            placeHolder={avaterPlaceholder}
                            imageId={imageUrl || ''}
                            parentClass="h-[70px] w-[70px] cursor-pointer"
                            imageClass=" rounded-full object-contain"
                            onClick={() => setToggleChangeProfileImage('change-profile-avater-dialog')}
                        />
                        {caretIsOn === 'addImage' &&
                            <div className="flex items-center gap-4">
                                <span
                                    className="block cursor-pointer border px-1 rounded-md"
                                    onClick={() => handleCancle('image')}
                                >
                                    Cancle
                                </span>
                                <span
                                    className="block cursor-pointer border px-1 rounded-md"
                                    onClick={() => {
                                        handleSaveSingleChanges();
                                        setImageChange(false);
                                    }}
                                >
                                    Save
                                </span>
                            </div>
                        }
                    </div>
                    <div id="bio" className="w-full flex justify-between items-center gap-4 ">
                        <Texarea
                            inputName={'Bio'}
                            placeHolder={'Talk about yourself'}
                            inputClass={`w-full min-h-[80px] text-sm outline-none border ${caretIsOn === 'Bio' ? 'border-gray-300' : 'border-gray-100 shadow-inner '} rounded-md p-2 mt-2`}
                            value={bio}
                            setValue={setBio}
                            labelClass="w-full text-base"
                            error={{ isTrue: false, errorClass: '', errorMsg: '' }}
                            callBack={(target) => setCaretIsOn(target?.name || '')}
                        />
                        {caretIsOn === 'Bio' &&
                            <div className="flex justify-between items-center gap-4">
                                <span
                                    className="block cursor-pointer border px-1 rounded-md"
                                    onClick={() => handleCancle('bio')}
                                >
                                    Cancle
                                </span>
                                <span
                                    className="block cursor-pointer border px-1 rounded-md"
                                    onClick={handleSaveSingleChanges}
                                >
                                    Save
                                </span>
                            </div>
                        }
                    </div>
                    <div id="sex" className="flex justify-between items-center gap-4">
                        <Selectinput
                            id="gender"
                            name="Sex"
                            arrOfList={['male', 'female', 'others']}
                            defaultValueClass="text-base text-center px-2 py-1 mt-2"
                            selectedValue={sex}
                            setSeletedValue={(value) => {
                                setSex(value);
                                setCaretIsOn('sex');
                            }}
                            parentClass="w-[120px]"
                            animation={true}
                        />
                        {caretIsOn === 'sex' &&
                            <div className="flex justify-between items-center gap-4">
                                <span
                                    className="block cursor-pointer border px-1 rounded-md"
                                    onClick={() => handleCancle('sex')}
                                >
                                    Cancle
                                </span>
                                <span
                                    className="block cursor-pointer border px-1 rounded-md"
                                    onClick={handleSaveSingleChanges}
                                >
                                    Save
                                </span>
                            </div>
                        }
                    </div>
                    {arrOfInputs &&
                        arrOfInputs.length &&
                        arrOfInputs.map((item) =>
                            <div id={item.name}
                                key={item.name}
                                className=" flex justify-between items-end gap-4">
                                <Input
                                    id={item.id}
                                    type={item.type}
                                    inputName={item.name}
                                    placeHolder={item.placeHolder}
                                    inputClass={`w-full text-sm outline-none border ${caretIsOn?.trim() === item.name.trim() ? 'border-gray-300' : 'border-gray-100 shadow-inner '} rounded-md p-2 mt-2`}
                                    value={item.value as Date & string}
                                    setValue={(value) => item.setValu(value as Date & string)}
                                    labelClass="w-full text-base"
                                    error={{ isTrue: false, errorClass: '', errorMsg: '' }}
                                    callBack={(target) => setCaretIsOn(target?.name || '')}
                                />

                                {caretIsOn?.trim() === item.name?.trim() &&
                                    <div className="flex justify-between items-center gap-4">
                                        <span
                                            className="block cursor-pointer border px-1 rounded-md"
                                            onClick={() => {
                                                handleCancle(item?.name);
                                            }}
                                        >
                                            Cancle
                                        </span>
                                        <span
                                            className="block cursor-pointer border px-1 rounded-md"
                                            onClick={handleSaveSingleChanges}
                                        >
                                            Save
                                        </span>
                                    </div>
                                }
                            </div>
                        )
                    }
                    <div id="country" className="flex justify-between items-center gap-4">
                        <Selectinput
                            id="country"
                            name="Country"
                            arrOfList={['Nigeria', 'USA', 'UK']}
                            defaultValueClass="text-base text-center px-2 py-1 mt-2"
                            selectedValue={country}
                            setSeletedValue={(value) => {
                                setCountry(value);
                                setCaretIsOn('country')
                            }}
                            parentClass="w-[120px]"
                            animation={true}
                        />
                        {caretIsOn === 'country' &&
                            <div className="flex justify-between items-center gap-4">
                                <span
                                    className="block cursor-pointer border px-1 rounded-md"
                                    onClick={() => handleCancle('bio')}
                                >
                                    Cancle
                                </span>
                                <span
                                    className="block cursor-pointer border px-1 rounded-md"
                                    onClick={handleSaveSingleChanges}
                                >
                                    Save
                                </span>
                            </div>
                        }
                    </div>
                </div>
                <div id="save-all" className="flex justify-end items-center">
                    {caretIsOn?.trim() &&
                        <button
                            className="cursor-pointer border px-1 rounded-md"
                            onClick={() => setLoadingDialog('loadingDialog')}
                        >
                            Save all changes
                        </button>
                    }
                </div>
                <Dialog
                    id='change-image-dialog-for-profile-avater'
                    parentClass="flex justify-center items-center"
                    childClass="-mt-60"
                    currentDialog={'change-profile-avater-dialog'}
                    dialog={toggleChangeProfileImage}
                    setDialog={() => setToggleChangeProfileImage('')}
                    children={
                        <div className='flex justify-around items-center gap-4 min-w-[280px] md:min-w-[480px] min-h-[140px] border-2 shadow rounded-md'>
                            <Button
                                id="choose-image-from-library"
                                buttonClass=""
                                children="Form library"
                                handleClick={() => setImageGalary({ displayImageGalary: 'blogpost-images-1', selectedImages: [] })}
                            />
                            <Fileinput
                                name=""
                                id="choose-local-image"
                                type="image"
                                placeHolder='From computer'
                                accept="image/*"
                                setValue={(value) => {
                                    getMedia({
                                        files: value,
                                        fileType: 'image',
                                        getValue: async ({ dataUrl, tempUrl, file }) => {
                                            setLoadingDialog('loading-dialog');
                                            const image: Imageprops | null = await createImage({ file, url: '/api/image/avater/add', fieldname: 'avater' })
                                            if (image) {
                                                setImageUrl(image._id)
                                                setLoadingDialog('');
                                                appDispatch(addAvaters(image));
                                                appDispatch(increaseTotalNumberOfUserAvaters(1));
                                            }
                                        }
                                    });
                                    setCaretIsOn('addImage');
                                    setImageChange(true);
                                }}
                            />
                        </div>
                    }
                />
                <Dialog
                    id="loading-dialog"
                    currentDialog="loading-dialog"
                    parentClass=""
                    childClass="flex justify-center items-center w-full h-full "
                    dialog={loadingDialog}
                    setDialog={setLoadingDialog}
                    children={
                        <svg className="animate-spin h-5 w-5 mr-3  rounded-e-full border-black border-2 " viewBox="0 0 24 24">
                        </svg>
                    }
                />
            </form> :
            <div>loading editing profile...</div>
        }
    </div>
};

export default Editeprofile;

