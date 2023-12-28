import clsx from "clsx";
import style from "./TransactionManagerFormCreateAccount.module.scss";
import { useState, useContext, Fragment, useEffect } from "react";
import { LoginContext } from "../../../../App";
import axios from "axios";
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';

function TransactionManagerFormCreateAccount(props) {
    const { userInfo } = useContext(LoginContext);

    // Input để lưu các name, phone, password
    const [inputs, setInputs] = useState({
        accountName: "",
        accountPhone: "",
        accountPassword: "",
    });

    const [errorForName, setErrorForName] = useState(false); // Check error cho name
    const [errorForPhone, setErrorForPhone] = useState(false); // Check error cho phone
    const [errorForPassword, setErrorForPassword] = useState(false); // Check error cho password

    const [isClickAddAccount, setIsClickAddAccount] = useState(false); // Check xem bấm vào nút add account không

    // Handle xử lý sự kiện bấm vào add account
    const handleIsClickAddAccount = async () => {
        setIsClickAddAccount(true);
        handleErrorForName();
        handleErrorForPhone();
        handleErrorForPassword();
        if (errorForPhone === false) {
            handleGetData();
        }
    };

    // Handle xử lý error cho name, nếu input name rỗng thì hiện error
    const handleErrorForName = () => {
        if (inputs.accountName === "") {
            setErrorForName(true);
        } else {
            setErrorForName(false);
        }
    };

    // Handle xử lý error cho phone, nếu input rỗng hoặc không đủ 10 chữ số hoặc không bắt đầu bằng 0 thì hiện error
    const handleErrorForPhone = () => {
        const phonePattern = /^\d{10}$/;

        if (inputs.accountPhone === "" || phonePattern.test(inputs.accountPhone) === false || inputs.accountPhone.charAt(0) !== '0') {
            setErrorForPhone(true);
        } else {
            setErrorForPhone(false);
        }
    };

    // Handle error cho password, nếu input rỗNg hoặc độ dài < 6 thì hiện error
    const handleErrorForPassword = () => {
        if (inputs.accountPassword === "" || inputs.accountPassword.length < 6) {
            setErrorForPassword(true);
        } else {
            setErrorForPassword(false);
        }
    };

    // Để cập nhật input name, phone, password khi có thay đổi
    const handleChange = (e) => {
        setInputs((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const [alertVisible, setAlertVisible] = useState(false); // Handle xem có hiện alert không
    const [checkIsSuccess, setCheckIsSuccess] = useState(true); // Handle xem hiện alert succcess hay failure

    // Hàm này để thực hiện tạo tài khoản cho nhân viên tại điểm giao dịch, ban đầu check xem số điện thoại có trùng không, trùng thì alert failure, nếu  không thì mới cho tạo thành công và hiện alert success
    const handleGetData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/account/countAccountByPhoneNumber", {
                params: {
                    phone: inputs.accountPhone
                }
            });

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
                if (response.data.message === "Phone number does not exist" && inputs.accountName !== "" && inputs.accountPhone !== "" && inputs.accountPassword !== "") {
                    await axios.post("http://localhost:8080/transaction-manager/createAccount", { ...inputs, unit: userInfo.uUnit });
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

    // Bấm enter = click Add Account
    const handleEnterKey = (event) => {
        if (event.key === "Enter") {
            handleIsClickAddAccount();
        }
    };

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
                        Add Account
                    </button>
                </div>
            </div >
        </Fragment>
    );
}

export default TransactionManagerFormCreateAccount;
