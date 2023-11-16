import clsx from "clsx";
import style from "./TransactionManagerFormCreateAccount.module.scss";
import { useState, useEffect } from "react"

function TransactionManagerFormCreateAccount(props) {
    const [inputs, setInputs] = useState({
        accountName: "",
        accountPhone: "",
        accountPassword: "",
    });

    const [errorForName, setErrorForName] = useState(false);
    const [errorForPhone, setErrorForPhone] = useState(false);
    const [errorForPassword, setErrorForPassword] = useState(false);

    const [isClickAddAccount, setIsClickAddAccount] = useState(false);

    const handleIsClickAddAccount = () => {
        setIsClickAddAccount(true);
        handleErrorForName();
        handleErrorForPhone();
        handleErrorForPassword();
    };

    const handleClickCreateAccount = () => {

    }

    const handleClickStatistic = () => {

    }

    const handleErrorForName = (e) => {
        if (inputs.accountName === "") {
            setErrorForName(true);
        } else {
            setErrorForName(false);
        }
    }

    const handleErrorForPhone = () => {
        if (inputs.accountPhone === "") {
            setErrorForPhone(true);
        } else {
            setErrorForPhone(false);
        }
    }

    const handleErrorForPassword = () => {
        if (inputs.accountPassword === "") {
            setErrorForPassword(true);
        } else {
            setErrorForPassword(false);
        }
    }

    const handleChange = (e) => {
        setInputs((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    console.log(inputs);

    return (
        <div className={clsx(style.container, props.className)}>
            <div className={clsx(style["form-container"])}>
                <form action="">
                    <div>
                        <label htmlFor="name" className={clsx(style.labelName)}>Name: </label>
                        <input
                            type="text"
                            className={clsx(style["input-zone"])}
                            id={clsx(style.name)}
                            onBlur={handleErrorForName}
                            name="accountName"
                            onChange={handleChange}
                            onClick={() => {setErrorForName(false)}}
                        />
                        <span
                            className={errorForName ? clsx(style.error) : clsx(style["error-hidden"])}
                            id={clsx(style["error-for-name"])}
                        >Please enter your name.
                        </span>
                    </div>

                    <div>
                        <label htmlFor="phone" className={clsx(style.labelName)}>Phone: </label>
                        <input 
                            type="text" 
                            className={clsx(style["input-zone"])} 
                            id={clsx(style.phone)} 
                            onBlur={handleErrorForPhone} 
                            name="accountPhone"
                            onChange={handleChange}
                            onClick={() => {setErrorForPhone(false)}}
                        />
                        <span
                            className={errorForPhone ? clsx(style.error) : clsx(style["error-hidden"])}
                            id={clsx(style["error-for-phone"])}
                        >Please enter your phone.
                        </span>
                    </div>

                    <div>
                        <label htmlFor="password" className={clsx(style.labelName)}>Password: </label>
                        <input 
                            type="password" 
                            className={clsx(style["input-zone"])} 
                            id={clsx(style.password)} 
                            onBlur={handleErrorForPassword} 
                            name="accountPassword"
                            onChange={handleChange}
                            onClick={() => {setErrorForPassword(false)}}
                        />
                        <span
                            className={errorForPassword ? clsx(style.error) : clsx(style["error-hidden"])}
                            id={clsx(style["error-for-password"])}
                        >Please enter your password
                        </span>
                    </div>
                </form>
            </div>

            <div className={clsx(style.accept)}>
                <button className={clsx(style["add-account"])} onClick={handleIsClickAddAccount}>Add Account</button>
            </div>
        </div>
    );
}

export default TransactionManagerFormCreateAccount;
