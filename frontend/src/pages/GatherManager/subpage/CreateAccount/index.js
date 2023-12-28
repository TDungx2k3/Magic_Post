import clsx from "clsx";
import style from "./CreateAccount.module.scss";
import { useState, useContext, Fragment, useEffect } from "react";
import { LoginContext } from "../../../../App";
import axios from "axios";
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import { useNavigate } from "react-router-dom";
// Call API được rồi, nma gần như mới là test, vì chưa lấy unit nên đang để unit defalt là "test, còn lại gần như ok"

function TransactionManagerFormCreateAccount(props) {
    const { userInfo } = useContext(LoginContext);

    const navigate = useNavigate();

    // Lưu các thông tin trong các input
    const [inputs, setInputs] = useState({
        accountName: "",
        accountPhone: "",
        accountPassword: "",
    });

    const [errorForName, setErrorForName] = useState(false); // Handle error cho name
    const [errorForPhone, setErrorForPhone] = useState(false); // Handle error cho phone
    const [errorForPassword, setErrorForPassword] = useState(false); // Handle error cho password

    const [isClickAddAccount, setIsClickAddAccount] = useState(false);

    // Handle xem đã click vào tạo tài khoản chưa
    const handleIsClickAddAccount = async () => {
        setIsClickAddAccount(true);
        handleErrorForName();
        handleErrorForPhone();
        handleErrorForPassword();
        if (errorForPhone === false) {
            handleGetData();
        }
    };

    // Handle error cho name, check nếu input name rỗng thì sẽ hiển thị ra error cho name
    const handleErrorForName = () => {
        if (inputs.accountName === "") {
            setErrorForName(true);
        } else {
            setErrorForName(false);
        }
    };

    // Handle error cho phone, check nếu input phone không đúng định dạng là 10 số hoặc rỗng hoặc không bắt đầu bằng số 0 thì sẽ hiển thị ra error cho phone
    const handleErrorForPhone = () => {
        const phonePattern = /^\d{10}$/;

        if (inputs.accountPhone === "" || phonePattern.test(inputs.accountPhone) === false || inputs.accountPhone.charAt(0) !== '0') {
            setErrorForPhone(true);
        } else {
            setErrorForPhone(false);
        }
    };

    // Handle error cho password, check nếu input password rỗng hoặc có độ dài < 6 thì hiển thị ra error cho password
    const handleErrorForPassword = () => {
        if (inputs.accountPassword === "" || inputs.accountPassword.length < 6) {
            setErrorForPassword(true);
        } else {
            setErrorForPassword(false);
        }
    };

    // Để lấy được giá trị tại các ô input
    const handleChange = (e) => {
        setInputs((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const [alertVisible, setAlertVisible] = useState(false); // Handle việc ẩn hiện của alert
    const [checkIsSuccess, setCheckIsSuccess] = useState(true); // Handle việc hiển thị alert thành công hay thất bại

    // Handle form submit
    const handleGetData = async () => {
        try {
            // Đếm tài khoản mà có số điện thoại là số điện thoại theo input không
            const response = await axios.get("http://localhost:8080/account/countAccountByPhoneNumber", {
                params: {
                    phone: inputs.accountPhone
                }
            });

            // Nếu response bên trên trả về là "Phone number exists" và các error là true thì sẽ hiển thị ra alert
            if (response.data.message === "Phone number exists" && errorForName === false && errorForPhone === false && errorForPassword === false) {
                setCheckIsSuccess(false);
                setAlertVisible(true);

                setTimeout(() => {
                    setAlertVisible(false);
                }, 1500);

                setInputs((prevInputs) => {
                    return {
                        ...prevInputs,
                        accountName: "",
                        accountPhone: "",
                        accountPassword: ""
                    };
                });
                document.getElementsByName("accountName")[0].value = "";
                document.getElementsByName("accountPhone")[0].value = "";
                document.getElementsByName("accountPassword")[0].value = "";
            } else {
                // Nếu response là "Phone number does not exist" và các error là false thì sẽ alert thành công"
                if (response.data.message === "Phone number does not exist" && inputs.accountName !== "" && inputs.accountPhone !== "" && inputs.accountPassword !== "") {
                    await axios.post("http://localhost:8080/gathering-manager/create-account-for-employee", { ...inputs, unit: userInfo.uUnit });
                    setCheckIsSuccess(true);
                    setAlertVisible(true);

                    setTimeout(() => {
                        setAlertVisible(false);
                    }, 1500);

                    setInputs((prevInputs) => {
                        return {
                            ...prevInputs,
                            accountName: "",
                            accountPhone: "",
                            accountPassword: ""
                        };
                    });
                    document.getElementsByName("accountName")[0].value = "";
                    document.getElementsByName("accountPhone")[0].value = "";
                    document.getElementsByName("accountPassword")[0].value = "";
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    // Bấm enter = bấm Add Account
    const handleEnterKey = (event) => {
        if (event.key === "Enter") {
            handleIsClickAddAccount();
        }
    };

    // Bấm back thì navigate về trang gather-manager
    const handleClickBackButton = () => {
        navigate("/gather-manager");
    }

    return (
        <Fragment>
            {
                alertVisible ? (
                    checkIsSuccess ? (
                        <Alert color="success" className={clsx(style.alert)} data-aos="fade-down">
                            <span className="font-medium">Create Successfully!</span>
                        </Alert>
                    ) : (
                        <Alert color="failure" icon={HiInformationCircle} className={clsx(style.alert)} data-aos="fade-down">
                            <span className="font-medium">Phone number already exists</span>
                        </Alert>
                    )
                ) : null
            }

            <div className={clsx(style.container, props.className)}>
                <div className={clsx(style["form-container"])}>
                    <form onSubmit={handleIsClickAddAccount}>
                        <div>
                            <label htmlFor="name" className={clsx(style.labelName)}>
                                Name:
                            </label>
                            <input
                                type="text"
                                className={clsx(style["input-zone"])}
                                onBlur={handleErrorForName}
                                name="accountName"
                                onChange={handleChange}
                                onClick={() => setErrorForName(false)}
                                onKeyDown={handleEnterKey}
                            />
                            <span
                                className={errorForName ? clsx(style.error) : clsx(style["error-hidden"])}
                                id={clsx(style["error-for-name"])}
                            >
                                Please enter your name.
                            </span>
                        </div>

                        <div>
                            <label htmlFor="phone" className={clsx(style.labelName)}>
                                Phone:
                            </label>
                            <input
                                type="text"
                                className={clsx(style["input-zone"])}
                                onBlur={handleErrorForPhone}
                                name="accountPhone"
                                onChange={handleChange}
                                onClick={() => setErrorForPhone(false)}
                                onKeyDown={handleEnterKey}
                            />
                            <span
                                className={errorForPhone ? clsx(style.error) : clsx(style["error-hidden"])}
                                id={clsx(style["error-for-phone"])}
                            >
                                Please enter a valid phone number.
                            </span>
                        </div>

                        <div>
                            <label htmlFor="password" className={clsx(style.labelName)}>
                                Password:
                            </label>
                            <input
                                type="password"
                                className={clsx(style["input-zone"])}
                                onBlur={handleErrorForPassword}
                                name="accountPassword"
                                onChange={handleChange}
                                onClick={() => setErrorForPassword(false)}
                                onKeyDown={handleEnterKey}
                            />
                            <span
                                className={errorForPassword ? clsx(style.error) : clsx(style["error-hidden"])}
                                id={clsx(style["error-for-password"])}
                            >
                                Please enter a valid password.
                            </span>
                        </div>
                    </form>
                </div>

                <div className={clsx(style.accept)}>
                    <button
                        className={clsx(style["add-account"])}
                        onClick={handleIsClickAddAccount}
                    >
                        Create Account
                    </button>

                    <button
                        className={clsx(style["back-button"])}
                        onClick={handleClickBackButton}
                    >
                        Back
                    </button>
                </div>
            </div >
        </Fragment>
    );
}

export default TransactionManagerFormCreateAccount;
