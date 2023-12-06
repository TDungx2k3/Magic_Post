import clsx from "clsx";
import style from "./ModifyAccountEmployee.module.scss";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


function ModifyAccountEmployee() {
    const location = useLocation();
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const account_id = searchParams.get("account_id");
        console.log(account_id);
    }, [location.search]);

    return (
        <div className={clsx(style.container)}>
            <div className={clsx(style["form-container"])}>
                <div>
                    <label htmlFor="Account Name">Enter your new name: </label>
                    <input type="text" placeholder="Enter your new name" />
                </div>

                <div>
                    <label htmlFor="Account Phone">Enter your new phone: </label>
                    <input type="text" placeholder="Enter your new phone" />
                </div>

                <div>
                    <label htmlFor="Account Password">Enter your new password: </label>
                    <input type="password" placeholder="Enter your new password" />
                </div>
            </div>

            <div className={clsx(style["btns-container"])}>
                <div>
                    <button id={clsx(style["save-btn"])}>Save</button>
                </div>

                <div>
                    <button id={clsx(style["cancel-btn"])}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default ModifyAccountEmployee;
