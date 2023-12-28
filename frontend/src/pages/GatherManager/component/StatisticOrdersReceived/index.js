import clsx from "clsx";
import style from "./StatisticOrdersReceived.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../../../App";

function StatisticOrdersReceived(props) {
    const userInfo = useContext(LoginContext);

    const [ordersReceived, setOrdersReceived] = useState([]); // Mảng để lưu các đơn hàng mà điểm tập kết nhận
    const [ordersReceivedRen, setOrdersReceivedRen] = useState([]); // Mảng để lưu các đơn hàng mà điểm tập kết gửi đi
    const [isGotOrdersReceived, setIsGotOrdersReceived] = useState(false); // Check xem đã get được data các đơn hàng nhận được chưa

    const maxItemsInOnePage = 5; // Chỉ render ra 5 order trong 1 trang
    let cnt;
    if (ordersReceived !== undefined) {
        cnt = ordersReceived.length;
    }
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(0);
    const [pages, setPages] = useState([]);
    
    // Dùng để cập nhật mảnrg pages
    const updatePages = () => {
        let tmpPages = [];
        for(let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    };

    // Dùng để hiển thị các order đã nhận, hiển thị trong trang thứ i
    const updateRenList = () => {
        // console.log(accountList);
        let tmpList;
        if (ordersReceived !== undefined) {
            tmpList = ordersReceived.slice(maxItemsInOnePage*(pageNum-1), maxItemsInOnePage*pageNum);
        }
        // console.log(tmpList);
        setOrdersReceivedRen(tmpList);
    }

    // Hàm này để get data order mà điểm tập kết nhận được từ database
    const getOrdersReceived = async () => {
        try {
            const tordersReceived = await axios.get("http://localhost:8080/gathering-manager/all-orders-received",
                {
                    params: { unit: userInfo.userInfo.uUnit }
                }
            );
            setOrdersReceived(tordersReceived.data[0]);
            // console.log(tordersReceived.data[0]);
            setPageNum(1);
            updatePages();
            updateRenList();
            setIsGotOrdersReceived(true);
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getOrdersReceived();
    }, [isGotOrdersReceived]);

    useEffect(() => {
        updateRenList();
        updatePages();
    }, [pageNum, ordersReceived])

    return (
        <Fragment>
            <div className={clsx(props.className)}>
                <div className={clsx(style.container, props.className)}>
                    {ordersReceivedRen && ordersReceivedRen.length > 0 ? (
                        ordersReceivedRen.map((ordersReceived, index) => (
                            <div className={clsx(style["sub-container"])} key={index}>
                                <div className={style["customer-container"]}>
                                    <div className={style.sender}>
                                        <div>
                                            <label>Sender Name: </label>
                                            <span>{ordersReceived.customer_name}</span>
                                        </div>

                                        <div>
                                            <label>Sender Phone: </label>
                                            <span>{ordersReceived.customer_phone}</span>
                                        </div>
                                    </div>

                                    <div className={clsx(style.receiver)}>
                                        <div>
                                            <label>Receiver Name: </label>
                                            <span>{ordersReceived.receiver_name}</span>
                                        </div>

                                        <div>
                                            <label>Receiver Phone: </label>
                                            <span>{ordersReceived.receiver_phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={clsx(style["order-container"])}>
                                    <div>
                                        <label htmlFor="Weight">Weight: </label>
                                        <span>{ordersReceived.weight} kg</span>
                                    </div>

                                    <div>
                                        <label htmlFor="Price">Price: </label>
                                        <span>{ordersReceived.price} VND</span>
                                    </div>

                                    <div>
                                        <label htmlFor="Date">Date: </label>
                                        <span>{ordersReceived.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div id={clsx(style["no-order"])}>
                            There are no valid orders
                        </div>
                    )}
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
                                                    setPageNum(index + 1);
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
                                                    setPageNum(index + 1);
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
                                            setPageNum(index + 1);
                                            updateRenList();
                                        }
                                    }>{index + 1}</button>
                                );
                            }
                        })
                    }
                </div>
            </div>
            
        </Fragment>
    );
}

export default StatisticOrdersReceived;
