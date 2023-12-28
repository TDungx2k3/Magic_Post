import clsx from "clsx";
import style from "./LostOrderListTransaction.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { LoginContext } from "../../../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LostOrderListTransaction() {
    const navigate = useNavigate();
    const userInfo = useContext(LoginContext)

    const [lostOrderRenList, setLostOrderRenList] = useState([]); // Lưu danh sách order sẽ render ở trang thứ i
    const [lostOrderList, setLostOrderList] = useState([]); // Lưu danh sách tất cả các order bị mất
    const [isFetchedData, setIsFetchedData] = useState(false); // Check xem đã get được danh sách order bị mất từ database chưa

    const maxItemsInOnePage = 5;
    let cnt = lostOrderList.length;
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(0);
    const [pages, setPages] = useState([]);
    
    // Lưu các trang vào mảng pages
    const updatePages = () => {
        let tmpPages = [];
        for(let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    }

    // Lưu danh sách các order bị mất sẽ được render vào mảng lostOrderRenList
    const updateRenList = () => {
        let tmpList = lostOrderList.slice(maxItemsInOnePage*(pageNum - 1), pageNum*maxItemsInOnePage);
        // console.log(denyList.slice(pageNum));
        setLostOrderRenList(tmpList);
    }

    // Get danh sách tất cả các order bị mất
    const getLostOrderList = async () => {
        try {
            const lostOrderList = await axios.get("http://localhost:8080/transaction-manager/get-lost-order-list",
                { params : { unit: userInfo.userInfo.uUnit } }
            )
            setLostOrderList(lostOrderList.data[0]);
            setIsFetchedData(true);
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getLostOrderList();
    }, [isFetchedData]);

    useEffect(() => {
        updateRenList();
        updatePages();
    }, [pageNum, lostOrderList])

    // Bấm nút back để quay về trang transaction-manager
    const handleBack = () => {
        navigate("/transaction-manager");
    }

    return (
        <Fragment>
            <Header />

            <div className={clsx(style.container)}>
                {lostOrderRenList && lostOrderRenList.length > 0 ? (
                    lostOrderRenList.map((lostOrderList, index) => (
                        <div className={clsx(style["sub-container"])} key={index}>
                            <div className={style["customer-container"]}>
                                <div className={style.sender}>
                                    <div>
                                        <label>Sender Name: </label>
                                        <span>{lostOrderList.customer_name}</span>
                                    </div>

                                    <div>
                                        <label>Sender Phone: </label>
                                        <span>{lostOrderList.customer_phone}</span>
                                    </div>
                                </div>

                                <div className={clsx(style.receiver)}>
                                    <div>
                                        <label>Receiver Name: </label>
                                        <span>{lostOrderList.receiver_name}</span>
                                    </div>

                                    <div>
                                        <label>Receiver Phone: </label>
                                        <span>{lostOrderList.receiver_phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx(style["order-container"])}>
                                <div>
                                    <label htmlFor="Weight">Weight: </label>
                                    <span>{lostOrderList.weight} kg</span>
                                </div>

                                <div>
                                    <label htmlFor="Price">Price: </label>
                                    <span>{lostOrderList.price} VND</span>
                                </div>

                                <div>
                                    <label htmlFor="Date">Date: </label>
                                    <span>{lostOrderList.date}</span>
                                </div>
                            </div>
                        </div>
                    )
                    )) :
                    (
                        <div id={clsx(style["no-order"])}>
                            There are no valid orders
                        </div>
                    )
                }
            </div>

            <div className={clsx(style.choosePageContainer)}>
                {
                    pages.map((page, index) => {
                        if(index == 0 || index == numOfPages - 1
                        || (index >= (pageNum - 2) && index <= pageNum )) {
                            if(index == pageNum -2 && pageNum > 3) {
                                return (
                                    <Fragment key={index}>
                                        <span>. . .</span>
                                        <button className= {clsx(style.pageBtn, {[style.pageBtnActive] : index == pageNum -1})} onClick={
                                            ()=>{
                                                setPageNum(index + 1)
                                                updateRenList();
                                            }
                                        }>{index + 1}</button>
                                    </Fragment>
                                );
                            }
                            else if (index == pageNum && pageNum < numOfPages - 2) {
                                return (
                                    <Fragment key={index}>
                                        <button className= {clsx(style.pageBtn, {[style.pageBtnActive] : index == pageNum -1})} onClick={
                                            ()=>{
                                                setPageNum(index + 1)
                                                updateRenList();
                                            }
                                        }>{index + 1}</button>
                                        <span>. . .</span>
                                    </Fragment>
                                );
                            }
                            else 
                            return(
                                <button className= {clsx(style.pageBtn, {[style.pageBtnActive] : index == pageNum -1})} key={index} onClick={
                                    ()=>{
                                        setPageNum(index + 1)
                                        updateRenList();
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

export default LostOrderListTransaction;
