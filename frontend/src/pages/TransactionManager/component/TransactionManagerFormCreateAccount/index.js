import clsx from "clsx";
import style from "./TransactionManagerFormCreateAccount.module.scss";
import { useState, useRef, useEffect } from "react"

function TransactionManagerFormCreateAccount() {

    // const clickStatistic = () => {
    //     var formContainer = document.querySelector(".form-container");
    //     formContainer.classList.add("form-container-hidden");
    //     formContainer.classList.remove("form-container");
    // };

    // const clickCreateAccount = () => {
    //     var formContainer = document.querySelector(".form-container-hidden");
    //     formContainer.classList.remove("form-container-hidden");
    //     formContainer.classList.add("form-container");
    // };

    // const handleErrorForName = () => {
    //     var inputForName = document.getElementById("name");
    //     var errorForName = document.getElementById("error-for-name");
    //     if (inputForName.value.trim() === "") {
    //         errorForName.classList.remove("error-hidden");
    //         errorForName.classList.add("error");
    //     } else {
    //         errorForName.classList.add("error-hidden");
    //     }
    // };

    // const handleErrorForPhone = () => {
    //     var inputForPhone = document.getElementById("phone");
    //     var errorForPhone = document.getElementById("error-for-phone");
    //     if (inputForPhone.value.trim() === "") {
    //         errorForPhone.classList.remove("error-hidden");
    //         errorForPhone.classList.add("error");
    //     } else {
    //         errorForPhone.classList.add("error-hidden");
    //     }
    // };

    // const handleErrorForPassword = () => {
    //     var inputForPassword = document.getElementById("password");
    //     var errorForPassword = document.getElementById("error-for-password");
    //     if (inputForPassword.value.trim() === "") {
    //         errorForPassword.classList.remove("error-hidden");
    //         errorForPassword.classList.add("error");
    //     } else {
    //         errorForPassword.classList.add("error-hidden");
    //     }
    // };

    const nameInputRef = useRef(null);
    useEffect(() => {
        nameInputRef.current.focus();
    }, []);

    const [errorForName, setErrorForName] = useState(false);
    const [errorForPhone, setErrorForPhone] = useState(false);
    const [errorForPassword, setErrorForPassword] = useState(false);

    const handleClickCreateAccount = () => {

    }

    const handleClickStatistic = () => {

    }

    const handleErrorForName = (e) => {
        setErrorForName(!errorForName);
    }

    const handleErrorForPhone = () => {
        setErrorForPhone(!errorForPhone);
    }

    const handleErrorForPassword = () => {
        setErrorForPassword(!errorForPassword);
    }

    return (
        <div className={clsx(style.container)}>
            <div className={clsx(style["button-container"])}>
                <button className={clsx(style.btns)} onClick={handleClickCreateAccount}>Create Account</button>
                <button className={clsx(style.btns)} onClick={handleClickStatistic}>Statistic Order Sent</button>
                <button className={clsx(style.btns)} onClick={handleClickStatistic}>Statistic Order Received</button>
            </div>

            <div className={clsx(style["form-container"])}>
                <form action="">
                    <div>
                        <label htmlFor="name" className={clsx(style.labelName)}>Name: </label>
                        <input 
                            type="text" 
                            className={clsx(style["input-zone"])} 
                            id={clsx(style.name)} 
                            onBlur={handleErrorForName}
                            ref={nameInputRef}
                        />
                        <span 
                            className={errorForName ? clsx(style.error) : clsx(style["error-hidden"])} 
                            id={clsx(style["error-for-name"])}
                            >Please enter your name.
                        </span>
                    </div>

                    <div>
                        <label htmlFor="phone" className={clsx(style.labelName)}>Phone: </label>
                        <input type="text" className={clsx(style["input-zone"])} id={clsx(style.phone)} onBlur={handleErrorForPhone} />
                        <span 
                            className={errorForPhone ? clsx(style.error) : clsx(style["error-hidden"])} 
                            id={clsx(style["error-for-phone"])}
                            >Please enter your phone.
                        </span>
                    </div>

                    <div>
                        <label htmlFor="password" className={clsx(style.labelName)}>Password: </label>
                        <input type="password" className={clsx(style["input-zone"])} id={clsx(style.password)} onBlur={handleErrorForPassword} />
                        <span 
                            className={errorForPassword ? clsx(style.error) : clsx(style["error-hidden"])} 
                            id={clsx(style["error-for-password"])}
                            >Please enter your password
                        </span>
                    </div>
                </form>
            </div>

            <div className={clsx(style.accept)}>
                <button className={clsx(style["add-account"])}>Add Account</button>
            </div>
        </div>
    );
}

export default TransactionManagerFormCreateAccount;
