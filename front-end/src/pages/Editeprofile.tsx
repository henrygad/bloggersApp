import { useEffect, useState } from "react";
import { Dialog, Displayimage, Fileinput, Input, Selectinput, Texarea } from "../components";
import { useGetLocalMedia, usePatchData } from "../hooks";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../redux/slices/userProfileSlices";

const Editeprofile = () => {
    const { userProfile: { 
        data: accountProfile, 
        loading: accountProfileLoading, 
        error: accountProfileError } } = useSelector((state) => state.userProfileSlices);
    const dispatch = useDispatch();
    const [dateOfBirth, setDateOfBirth] = useState<Date | string>('');
    const [website, setWebsite] = useState('');
    const [country, setCountry] = useState('Nigeria');
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [sex, setSex] = useState('male');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState('gethenryimage.com');
    const [caretIsOn, setCaretIsOn] = useState('');
    const [viewImage, setViewImage] = useState(false);
    const [loadingDialog, setLoadingDialog] = useState('');
    const [imageSettingDialog, setImageSettingDialog] = useState('')
    const [imageChanged, setImageChange] = useState(false);
    const getMedia = useGetLocalMedia();
    const { patchData, loading, error } = usePatchData();
    const [file, setFile] = useState<Blob | string>('');
    const url = '/api/editprofile';


    const arrOfInputs = [
        {
            name: 'Full name',
            type: 'text',
            placeHolder: '',
            value: fullName,
            setValu: (value: string) => setFullName(value),
        },
        {
            name: 'Date of birth',
            type: 'date',
            placeHolder: '',
            value: dateOfBirth,
            setValu: (value: Date) => setDateOfBirth(value),
        },
        {
            name: 'Email',
            type: 'email',
            placeHolder: 'example@gmail.com',
            value: email,
            setValu: (value: string) => setEmail(value),
        },
        {
            name: 'phone number',
            type: 'phonenumber',
            placeHolder: '+234',
            value: phoneNumber,
            setValu: (value: string) => setPhoneNumber(value),
        },
        {
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
            displayImage: null,
            email,
            name: fullName,
            dateOfBirth,
            country,
            sex,
            website,
            bio,
            phoneNumber,
        };
        const formData = new FormData();
        formData.append('avater', file);
        formData.append('data', JSON.stringify(body));

        const response = await patchData(url, formData);

        if (response.ok) {
            dispatch(editProfile(response.data))
            setImageChange(false);
            setCaretIsOn('');
            setFile('');
        };
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

        if (input.toLocaleLowerCase().trim() === 'dateofbirth') setDateOfBirth(dateOfBirth);
        if (input.toLocaleLowerCase().trim() === 'image') setImageUrl("/api/image/" + displayImage);
        if (input.toLocaleLowerCase().trim() === 'fullname') setFullName(name);
        if (input.toLocaleLowerCase().trim() === 'country') setCountry(country);
        if (input.toLocaleLowerCase().trim() === 'website') setWebsite(website);
        if (input.toLocaleLowerCase().trim() === 'bio') setBio(bio);
        if (input.toLocaleLowerCase().trim() === 'sex') setSex(sex);
        if (input.toLocaleLowerCase().trim() === 'phonenumber') setPhoneNumber(phoneNumber);
        if (input.toLocaleLowerCase().trim() === 'email') setEmail(email);

        setCaretIsOn('');
    };

    const handleDefaultStateValues = ()=>{
        const {
            displayImage, email, name, dateOfBirth, country, sex, website, bio, phoneNumber,
        } = accountProfile;

        setDateOfBirth(dateOfBirth || '');
        setImageUrl("/api/image/" + displayImage || '');
        setFullName(name || '');
        setCountry(country || 'USA');
        setWebsite(website || '');
        setBio(bio || '');
        setSex(sex || 'male');
        setPhoneNumber(phoneNumber || '');
        setEmail(email || '');
    };

    useEffect(() => {
       accountProfile && handleDefaultStateValues()
    }, [accountProfile]);

    useEffect(() => {
        if (loading) {
            setLoadingDialog('loadingDialog');
        } else {
            setLoadingDialog('');
        };
    }, [loading]);

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
                            imageUrl={imageUrl}
                            parentClass="h-[70px] w-[70px] cursor-pointer"
                            imageClass=" rounded-full object-contain"
                            onClick={() => setImageSettingDialog('imageSettingDialog')}
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

                                {caretIsOn?.trim() === item.name.trim() &&
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
                    {caretIsOn.trim() && <button className="cursor-pointer border px-1 rounded-md">Save all changes</button>}
                </div>

                <div id="dialog">
                    {/* avater dialog */}
                    <Dialog
                        id="imageSettingDialog"
                        currentDialog="imageSettingDialog"
                        parentClass="flex justify-center items-center w-full h-full"
                        childClass="relative"
                        children={
                            <div className="relative min-w-[280px] border shadow-md rounded-md ">
                                <div className="flex justify-between items-center relative w-full">
                                    {!viewImage ?
                                        <span
                                            className="block absolute top-0 left-0 cursor-pointer z-20"
                                            onClick={() => setImageSettingDialog('')}
                                        >close</span> :
                                        <span
                                            className="block absolute top-0 right-0 cursor-pointer z-20"
                                            onClick={() => setViewImage(!viewImage)}
                                        >Go back</span>
                                    }
                                </div>
                                <div
                                    className={`${!viewImage ? 'h-[200px] w-[320px] cursor-pointer' : ' container h-screen w-screen'} py-2 border `}
                                >
                                    <Displayimage
                                        id="advater"
                                        imageUrl={imageUrl}
                                        parentClass="w-full h-full"
                                        imageClass="object-contain"
                                        onClick={() => !viewImage && setViewImage(!viewImage)}
                                    />
                                </div>
                                {!viewImage &&
                                    <>
                                        <div className="flex justify-center items-center gap-4 p-2">
                                            <span
                                                className="cursor-pointer border px-1 rounded-md"
                                                onClick={() => setViewImage(!viewImage)}
                                            >
                                                View image
                                            </span>
                                            <Fileinput
                                                name=""
                                                id="choose-local-image"
                                                setValue={(value) => {
                                                    getMedia({
                                                        files: value,
                                                        fileType: 'image',
                                                        getValue: ({ url, file }) => {
                                                            setFile(file);
                                                            setImageUrl(url.toString())
                                                        }
                                                    });
                                                    setCaretIsOn('addImage');
                                                    setImageChange(true);
                                                }}
                                                height="30px"
                                                width="40px"
                                            />
                                            {imageChanged && <span
                                                className="cursor-pointer border px-1 rounded-md"
                                                onClick={() => setImageSettingDialog('')}
                                            >
                                                Add image
                                            </span>}
                                        </div>
                                    </>
                                }
                            </div>
                        }
                        dialog={imageSettingDialog}
                        setDialog={setImageSettingDialog}
                    />
                    {/* display loading to the screan */}
                    <Dialog
                        id="loadingDialog"
                        currentDialog="loadingDialog"
                        parentClass=" container w-full h-full"
                        childClass="flex justify-center items-center w-full h-full "
                        children={
                            <svg className="animate-spin h-5 w-5 mr-3  rounded-e-full border-black border-2 " viewBox="0 0 24 24">
                            </svg>
                        }
                        dialog={loadingDialog}
                        setDialog={setLoadingDialog}
                    />
                </div>
            </form> :
            <div>loading editing profile...</div>
        }
    </div>
};

export default Editeprofile;

