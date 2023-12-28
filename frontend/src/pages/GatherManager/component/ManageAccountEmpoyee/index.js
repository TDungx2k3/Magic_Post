import clsx from "clsx";
import style from "./ManageAccountEmployee.module.scss";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../../../../App";
import { Link } from "react-router-dom";

function ManageAccountEmployee(props) {
    const navigate = useNavigate();
    const [confirmHidden, setConfirmHidden] = useState(true); // Dùng để check alert lúc bấm xoá tài khoản của nhân viên xem liệu có muốn xoá không
    const [isHide, setIsHide] = useState(true); // Dùng để check khi bấm vào ẩn đi cái alert trên
    const [hasFetchedData, setHasFetchedData] = useState(false); // Dùng để check xem đã fetch được account của nhân viên chưa

    const { userInfo } = useContext(LoginContext);
    const [accountList, setAccountList] = useState([]); // Dùng để lưu account nhân viên
    const [accountRenList, setAccountRenList] = useState([]); // Dùng để lưu account nhân viên ở trang thứ i

    const [accountId, setAccountId] = useState(); // Lưu account id

    const maxItemsInOnePage = 5; // Phân trang, trong 1 trang có tối đa 5 item
    let cnt = accountList.length;
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(0);
    const [pages, setPages] = useState([]);

    // Hàm này tạo 1 mảng các trang, sau đó cho vào mảng pages
    const updatePages = () => {
        let tmpPages = [];
        for (let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    };

    // Hàm này để khi bấm vào trang nào thì sẽ render ra tài khoản nhân viên
    const updateAccRenList = () => {
        // console.log(accountList);
        let tmpList = accountList.slice(maxItemsInOnePage * (pageNum - 1), maxItemsInOnePage * pageNum);
        // console.log(tmpList);
        setAccountRenList(tmpList);
    }

    // Hàm này để get tất cả tài khoản của nhân viên thuộc điểm giao dịch hiện tại, sau đó set vào mảng accountList
    const getAllAccounts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/gathering-manager/get-all-employee", {
                params: {
                    unit: userInfo.uUnit
                }
            });
            setAccountList(response.data);
            setPageNum(1);
            updatePages();
            updateAccRenList();
            // console.log(response.data);
            setHasFetchedData(true);
        } catch (error) {
            console.log(error);
        }
    }

    // Hàm này để xoá tài khoản của nhân viên
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
        getAllAccounts();
    }, [hasFetchedData]);

    useEffect(() => {
        updateAccRenList();
        updatePages();
    }, [pageNum, accountList])

    return (
        <Fragment>
            <div className={clsx(props.className)}>
                <div className={clsx(style.container, props.className)}>
                    {accountRenList && accountRenList.length > 0 ? (
                        accountRenList.map((account, index) => (
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
                                            // console.log(accountId);
                                        }}
                                    >
                                        <i className="ti-trash"></i>
                                    </div>

                                    <Link to={`/modify-account?account_id=${account.account_id}`}>
                                        <div id={clsx(style.modify)}>
                                            <i className="ti-reload"></i>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div id={clsx(style["no-account"])}>There are no valid accounts</div>
                    )}
                </div>

                <div className={clsx(style.choosePageContainer)}>
                    {
                        pages.map((page, index) => {
                            if (index == 0 || index == numOfPages - 1
                                || (index >= (pageNum - 2) && index <= pageNum)) {
                                if (index == pageNum - 2 && pageNum > 3) {
                                    return (
                                        <Fragment key={index}>
                                            <span>. . .</span>
                                            <button className={clsx(style.pageBtn, { [style.pageBtnActive]: index == pageNum - 1 })} onClick={
                                                () => {
                                                    setPageNum(index + 1);
                                                    updateAccRenList();
                                                }
                                            }>{index + 1}</button>
                                        </Fragment>
                                    );
                                }
                                else if (index == pageNum && pageNum < numOfPages - 2) {
                                    return (
                                        <Fragment key={index}>
                                            <button className={clsx(style.pageBtn, { [style.pageBtnActive]: index == pageNum - 1 })} onClick={
                                                () => {
                                                    setPageNum(index + 1);
                                                    updateAccRenList();
                                                }
                                            }>{index + 1}</button>
                                            <span>. . .</span>
                                        </Fragment>
                                    );
                                }
                                else
                                    return (
                                        <button className={clsx(style.pageBtn, { [style.pageBtnActive]: index == pageNum - 1 })} key={index} onClick={
                                            () => {
                                                setPageNum(index + 1);
                                                updateAccRenList();
                                            }
                                        }>{index + 1}</button>
                                    );
                            }
                        })
                    }
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
                                        // console.log(accountId);
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
            </div>

        </Fragment>
    );
}

export default ManageAccountEmployee;
