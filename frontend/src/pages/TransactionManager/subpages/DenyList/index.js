import clsx from "clsx";
import style from "./DenyList.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import axios from "axios";
import { LoginContext } from "../../../../App";
import { useNavigate } from "react-router-dom";

function DenyList() {
    const navigate = useNavigate();
    const userInfo = useContext(LoginContext);
    console.log(userInfo.userInfo.uUnit);

    const [denyList, setDenyList] = useState([]); // Lưu danh sách khách hàng deny
    const [denyRenList, setDenyRenList] = useState([]); // Lưu danh sách khách hàng deny sẽ được render trong trang thứ i
    const [isFetchedData, setIsFetchedData] = useState(false); // Check xem đã get được danh sách khách deny chưa

    const maxItemsInOnePage = 5;
    let cnt = denyList.length;
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(0);
    const [pages, setPages] = useState([]);

    const updatePages = () => {
        let tmpPages = [];
        for (let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    };

    const updateDenyRenList = () => {
        let tmpDenyList = denyList.slice(maxItemsInOnePage * (pageNum - 1), pageNum * maxItemsInOnePage);
        // console.log(denyList.slice(pageNum));
        setDenyRenList(tmpDenyList);
    }

    // Get danh sách khách hàng deny
    const getDenyList = async () => {
        try {
            const denyOList = await axios.get("http://localhost:8080/transaction-manager/get-deny-list",
                {
                    params: { unit: userInfo.userInfo.uUnit }
                });
            setDenyList(denyOList.data[0]);
            // console.log(denyOList.data[0]);
            setPageNum(1);
            updatePages();
            updateDenyRenList();
            setIsFetchedData(true);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getDenyList();
    }, [isFetchedData]);

    useEffect(() => {
        updateDenyRenList();
        updatePages();
    }, [pageNum, denyList])

    console.log(denyList);

    // Bấm nút back để quay về trang transaction-manager
    const handleBack = () => {
        navigate("/transaction-manager");
    }

    return (
        <Fragment>
            <Header />

            <div className={clsx(style.container)}>
                {denyRenList && denyRenList.length > 0 ? (
                    denyRenList.map((denyList, index) => (
                        <div className={clsx(style["sub-container"])} key={index}>
                            <div className={style["customer-container"]}>
                                <div className={style.sender}>
                                    <div>
                                        <label>Sender Name: </label>
                                        <span>{denyList.customer_name}</span>
                                    </div>

                                    <div>
                                        <label>Sender Phone: </label>
                                        <span>{denyList.customer_phone}</span>
                                    </div>
                                </div>

                                <div className={clsx(style.receiver)}>
                                    <div>
                                        <label>Receiver Name: </label>
                                        <span>{denyList.receiver_name}</span>
                                    </div>

                                    <div>
                                        <label>Receiver Phone: </label>
                                        <span>{denyList.receiver_phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx(style["order-container"])}>
                                <div>
                                    <label htmlFor="Weight">Weight: </label>
                                    <span>{denyList.weight} kg</span>
                                </div>

                                <div>
                                    <label htmlFor="Price">Price: </label>
                                    <span>{denyList.price} VND</span>
                                </div>

                                <div>
                                    <label htmlFor="Date">Date: </label>
                                    <span>{denyList.date}</span>
                                </div>
                            </div>
                        </div>
                    )
                    )) :
                    (
                        <div id={clsx(style["no-customer"])}>
                            There are no valid customers
                        </div>
                    )
                }
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
                                                updateDenyRenList();
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
                                                setPageNum(index + 1)
                                                updateDenyRenList();
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
                                            setPageNum(index + 1)
                                            updateDenyRenList();
                                        }
                                    }>{index + 1}</button>
                                );
                        }
                    })
                }
            </div>

            <button className={clsx(style.back)} onClick={handleBack}>
                Back
            </button>

            <Footer />
        </Fragment>
    )
}

export default DenyList;
