import clsx from "clsx";
import style from "./ManageAccountEmployee.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageAccountEmployee(props) {
    const navigate = useNavigate(); // Fix: Add parentheses
    const [confirmHidden, setConfirmHidden] = useState(true);
    const [isHide, setIsHide] = useState(true);

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
                    <div
                        id={clsx(style.delete)}
                        onClick={() => {
                            setConfirmHidden(false);
                            setIsHide(false);
                        }}
                    >
                        <i className="ti-trash"></i>
                    </div>

                    <div id={clsx(style.modify)}>
                        <i className="ti-reload"></i>
                    </div>
                </div>

                <div
                    className={clsx(style.confirmDeleteGatherContainer, {
                        [style.hidden]: confirmHidden,
                        [style.hideAll]: isHide,
                    })}
                    onClick={() => {
                        setConfirmHidden(true);
                    }}
                    data-aos="zoom-out-up"
                    data-aos-duration="1000"
                >
                    <div
                        className={clsx(style.contentCF)}
                        onClick={(e) => {
                            setConfirmHidden(false);
                            e.stopPropagation();
                        }}
                    >
                        <h2>Are you sure to delete this gathering?</h2>
                        <p>This action is irreversible.</p>
                        <div className={clsx(style.confirmBtns)}>
                            <div
                                className={clsx(style.yesBtn)}
                                onClick={async (e) => {
                                    if (
                                        window.confirm(
                                            "Do you want to delete this transaction?"
                                        )
                                    ) {
                                        // await deleteGather();
                                        // await deleteAllAccountInGather();
                                        setConfirmHidden(true);
                                        // navigate("/");
                                        setTimeout(() => {
                                            navigate("/gather-manager");
                                        }, 0);
                                    }
                                }}
                            >
                                Yes
                            </div>
                            <div
                                className={clsx(style.noBtn)}
                                onClick={(e) => {
                                    setConfirmHidden(true);
                                    e.stopPropagation();
                                }}
                            >
                                No
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageAccountEmployee;
