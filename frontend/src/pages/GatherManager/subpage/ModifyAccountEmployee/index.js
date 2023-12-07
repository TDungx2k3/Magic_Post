import clsx from "clsx";
import style from "./ModifyAccountEmployee.module.scss";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function ModifyAccountEmployee() {
    const [accountId, setAccountId] = useState();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const account_id = searchParams.get("account_id");
        setAccountId(account_id);
    }, [location.search]);

    const [inputs, setInputs] = useState({
        accountName: "",
        accountPhone: "",
        accountPassword: "",
    });

    const handleChange = (e) => {
        setInputs((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const [errorForName, setErrorForName] = useState(false);
    const [errorForPhone, setErrorForPhone] = useState(false);
    const [errorForPassword, setErrorForPassword] = useState(false);

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

    const handleSubmit = () => {
        handleErrorForName();
        handleErrorForPhone();
        handleErrorForPassword();
        updateInfo();
    }

    // Tối nay làm nốt check nếu sđt mới bị trùng với sđt của mấy tk khác, chỉ cho phép đổi sđt là số khác hoặc giữ nguyên số cũ
    const updateInfo = async () => {
        try {
            const thisPhone = await axios.get("http://localhost:8080/gathering-manager/get-employee-by-id", {
                params: {
                    account_id: accountId
                }
            });
            if (inputs.accountPhone === thisPhone.data[0].account_phone) {
                if (inputs.accountName !== "" && inputs.accountPhone !== "" && inputs.accountPassword !== "" && errorForName === false && errorForPhone === false && errorForPassword === false) {
                    axios.post("http://localhost:8080/gathering-manager/update-account-by-id", {
                        account_id: accountId,
                        account_name: inputs.accountName,
                        account_phone: inputs.accountPhone,
                        account_password: inputs.accountPassword,
                    });
                    alert("Update successfully!");
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
            } else {
                const checkDuplicate = await axios.get("http://localhost:8080/account/countAccountByPhoneNumber", {
                    params: {
                        phone: inputs.accountPhone
                    }
                });
                console.log(checkDuplicate);
                if (checkDuplicate.data.message === "Phone number does not exist") {
                    if (inputs.accountName !== "" && inputs.accountPhone !== "" && inputs.accountPassword !== "" && errorForName === false && errorForPhone === false && errorForPassword === false) {
                        axios.post("http://localhost:8080/gathering-manager/update-account-by-id", {
                            account_id: accountId,
                            account_name: inputs.accountName,
                            account_phone: inputs.accountPhone,
                            account_password: inputs.accountPassword,
                        });
                        alert("Update successfully!");
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
                } else {
                    alert("Your phone is duplicated!")
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={clsx(style.container)}>
            <div className={clsx(style["form-container"])}>
                <div>
                    <label htmlFor="Account Name">Enter your new name: </label>
                    <input
                        type="text"
                        placeholder="Enter your new name"
                        name="accountName"
                        onChange={handleChange}
                        onBlur={handleErrorForName}
                        onClick={() => { setErrorForName(false) }}
                    />
                    <div className={errorForName ? clsx(style.error) : clsx(style["error-hidden"])}>Please enter valid name!</div>
                </div>

                <div>
                    <label htmlFor="Account Phone">Enter your new phone: </label>
                    <input
                        type="text"
                        placeholder="Enter your new phone"
                        name="accountPhone"
                        onChange={handleChange}
                        onBlur={handleErrorForPhone}
                        onClick={() => { setErrorForPhone(false) }}
                    />
                    <div className={errorForPhone ? clsx(style.error) : clsx(style["error-hidden"])}>Please enter valid phone!</div>
                </div>

                <div>
                    <label htmlFor="Account Password">Enter your new password: </label>
                    <input
                        type="password"
                        placeholder="Enter your new password"
                        name="accountPassword"
                        onChange={handleChange}
                        onBlur={handleErrorForPassword}
                        onClick={() => { setErrorForPassword(false) }}
                    />
                    <div className={errorForPassword ? clsx(style.error) : clsx(style["error-hidden"])}>Please enter valid password!</div>
                </div>
            </div>

            <div className={clsx(style["btns-container"])}>
                <div>
                    <button
                        id={clsx(style["save-btn"])}
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>

                <div>
                    <Link to="/gather-manager">
                        <button id={clsx(style["cancel-btn"])}>Cancel</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ModifyAccountEmployee;
