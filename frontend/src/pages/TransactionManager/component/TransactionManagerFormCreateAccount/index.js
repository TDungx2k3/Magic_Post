import clsx from "clsx";
import style from "./TransactionManagerFormCreateAccount.module.scss";
import { useState, useEffect, useRef, useContext } from "react";
import { LoginContext } from "../../../../App";
import axios from "axios";

// Call API được rồi, nma gần như mới là test, vì chưa lấy unit nên đang để unit defalt là "test, còn lại gần như ok"

function TransactionManagerFormCreateAccount(props) {
    const { isLogin, setIsLogin, userInfo, setUserInfo} = useContext(LoginContext);
    console.log(userInfo.uUnit);

    const [inputs, setInputs] = useState({
        accountName: "",
        accountPhone: "",
        accountPassword: "",
    });

    const [errorForName, setErrorForName] = useState(false);
    const [errorForPhone, setErrorForPhone] = useState(false);
    const [errorForPassword, setErrorForPassword] = useState(false);

    const [isClickAddAccount, setIsClickAddAccount] = useState(false);

    const handleIsClickAddAccount = async () => {
        setIsClickAddAccount(true);
        handleErrorForName();
        handleErrorForPhone();
        handleErrorForPassword();
        if (errorForPhone === false) {
            handleGetData();
        }
    };

    const handleErrorForName = () => {
        if (inputs.accountName === "") {
            setErrorForName(true);
        } else {
            setErrorForName(false);
        }
    };

    const handleErrorForPhone = () => {
        const phonePattern = /^\d{10}$/;

        if (inputs.accountPhone === "" || phonePattern.test(inputs.accountPhone) === false || inputs.accountPhone.charAt(0) !== '0') {
            setErrorForPhone(true);
        } else {
            setErrorForPhone(false);
        }
    };

    const handleErrorForPassword = () => {
        if (inputs.accountPassword === "" || inputs.accountPassword.length < 6) {
            setErrorForPassword(true);
        } else {
            setErrorForPassword(false);
        }
    };

    const handleChange = (e) => {
        setInputs((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    // const [messageCheckDuplicate, setMessageCheckDuplicate] = useState("");

    // const [checkIsCreateSuccess, setCheckIsCreateSuccess] = useState();

    // const handleCheckIsCreateSuccess = () => {
    //     setCheckIsCreateSuccess(true);
    // }

    // useEffect(() => {
    //     handleCheckIsCreateSuccess();
    // }, [checkIsCreateSuccess])

    // useEffect(() => {
    //     handleCheckIsCreateSuccess();
    // }, [checkIsCreateSuccess])

    const handleGetData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/account/countAccountByPhoneNumber", {
                params: {
                    phone: inputs.accountPhone
                }
            });

            if (response.data.message === "Phone number exists" && errorForName === false && errorForPhone === false && errorForPassword === false) {
                alert("Phone number already exists");
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
                    alert("Create Successfully");
                    // setCheckIsCreateSuccess(true);
                    // handleCheckIsCreateSuccess();
                    // console.log(checkIsCreateSuccess);
                    // setTimeout(() => {
                    //     setCheckIsCreateSuccess(false);
                    // }, 2000);
                    // setTimeout(() => {
                    //     console.log(checkIsCreateSuccess);
                    // }, 2500);
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
                    // setCheckIsCreateSuccess(true);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={clsx(style.container, props.className)}>

            <div className={clsx(style["form-container"])}>
                
                {/* <div className={clsx({ [style["alert-successfully"]]: checkIsCreateSuccess === true}, { [style["alert-successfully-hidden"]]: checkIsCreateSuccess === false})} data-aos="zoom-in">
                    <p>
                        Create Account Successfully!
                    </p>
                    <span className={clsx(style.wrapper)}>
                        <svg className={clsx(style.checkmark)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className={clsx(style["checkmark__circle"])} cx="20" cy="20" r="25" fill="none" />
                            <path className={clsx(style["checkmark__check"])} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </span>
                </div> */}

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
        </div>
    );
}

export default TransactionManagerFormCreateAccount;
