import clsx from "clsx";
import style from "./ManageAccountEmployee.module.scss";

function ManageAccountEmployee() {
    return (
        <div className={clsx(style.container)}>
            <div className={clsx(style["sub-container"])}>
                <div>
                    <div>
                        <label htmlFor="Account ID">Account ID: </label>
                        <span></span>
                    </div>

                    <div>
                        <label htmlFor="Account Name">Account Name: </label>
                        <span></span>
                    </div>

                    <div>
                        <label htmlFor="Account Phone">Account Phone: </label>
                        <span></span>
                    </div>

                    <div>
                        <label htmlFor="Account Password">Account Password: </label>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageAccountEmployee;
