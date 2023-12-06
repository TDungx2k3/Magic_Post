import clsx from "clsx";
import style from "./ManageAccountEmployee.module.scss";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../../../../App";

function ManageAccountEmployee(props) {
    const navigate = useNavigate();
    const [confirmHidden, setConfirmHidden] = useState(true);
    const [isHide, setIsHide] = useState(true);
    const [hasFetchedData, setHasFetchedData] = useState(false);

    const { userInfo } = useContext(LoginContext);
    const [accountList, setAccountList] = useState([]);
    const [rerender, setRerender] = useState(true);

    const [accountId, setAccountId] = useState();

    const getAllAccounts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/gathering-manager/get-all-employee", {
                params: {
                    unit: userInfo.uUnit
                }
            });
            setAccountList(response.data);
            console.log(response.data);
            setHasFetchedData(true);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteAccountById = async (accountId) => {
        try {
            await axios.post("http://localhost:8080/gathering-manager/delete-account-by-id", {
                account_id: accountId
            });
            getAllAccounts();
        } catch (err) {
            console.log(err);
        }
    }    

    useEffect(() => {
        if (!hasFetchedData) {
            getAllAccounts();
            setRerender(false);
        }
    }, [rerender, hasFetchedData]);

    return (
        <Fragment>
            <div className={clsx(style.container, props.className)}>
                {accountList.map((account, index) => (
                    <div className={clsx(style["sub-container"])} key={index}>
                        <div className={clsx(style["account-container"])}>
                            <div>
                                <label htmlFor="Account ID">Account ID: </label>
                                <span>{account.account_id}</span>
                            </div>

                            <div>
                                <label htmlFor="Account Name">Account Name: </label>
                                <span>{account.account_name}</span>
                            </div>

                            <div>
                                <label htmlFor="Account Phone">Account Phone: </label>
                                <span>{account.account_phone}</span>
                            </div>
                        </div>

                        <div className={clsx(style["btns-container"])}>
                            <div
                                id={clsx(style.delete)}
                                onClick={() => {
                                    setConfirmHidden(false);
                                    setIsHide(false);
                                    setAccountId(account.account_id);
                                    console.log(accountId);
                                }}
                            >
                                <i className="ti-trash"></i>
                            </div>

                            <div id={clsx(style.modify)}>
                                <i className="ti-reload"></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={clsx(style.confirmDeleteAccountContainer, { [style.hidden]: confirmHidden, [style.hideAll]: isHide })}
                onClick={() => {
                    setConfirmHidden(true);
                }}
                data-aos="zoom-out-up" data-aos-duration="1000">
                <div className={clsx(style.contentCF)}
                    onClick={(e) => {
                        setConfirmHidden(false);
                        e.stopPropagation();
                    }}>
                    <h2>Are you sure to delete this account?</h2>
                    <p>This action is irreversible.</p>
                    <div className={clsx(style.confirmBtns)}>
                        <div className={clsx(style.yesBtn)}
                            onClick={async (e) => {
                                if (window.confirm("Do you want to delete this account?")) {
                                    console.log(accountId);
                                    await deleteAccountById(accountId);
                                    setConfirmHidden(true);
                                    navigate("/");
                                    setTimeout(() => {
                                        navigate("/gather-manager")
                                    }, 0);
                                }
                            }}
                        >Yes</div>
                        <div className={clsx(style.noBtn)}
                            onClick={(e) => {
                                setConfirmHidden(true);
                                e.stopPropagation();
                            }}
                        >No</div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ManageAccountEmployee;
