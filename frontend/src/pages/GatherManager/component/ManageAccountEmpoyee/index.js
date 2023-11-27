import clsx from "clsx";
import style from "./ManageAccountEmployee.module.scss";

function ManageAccountEmployee(props) {
    return (
        <div className={clsx(style.container, props.className)}>
            <div className={clsx(style["sub-container"])}>
                <div className={clsx(style["account-container"])}>
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
                </div>

                <div className={clsx(style["btns-container"])}>
                    <div id={clsx(style.delete)}>
                        <i class="ti-trash"></i>
                    </div>

                    <div id={clsx(style.modify)}>
                        <i class="ti-reload"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageAccountEmployee;
