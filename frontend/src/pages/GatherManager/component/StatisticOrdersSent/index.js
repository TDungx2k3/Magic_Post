import clsx from "clsx";
import style from "./StatisticOrdersSent.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../../../App";

function StatisticOrdersSent(props) {
    const userInfo = useContext(LoginContext);

    const [ordersSent, setOrdersSent] = useState([]); // Mảng dùng để lưu lại các order mà điểm tập kết gửi đi
    const [ordersSentRen, setOrdersSentRen] = useState([]); // Mảng để lưu lại các order sẽ render trong trang thứ i
    const [isGotOrdersSent, setIsGotOrdersSent] = useState(false); // Biến dùng để check xem đã get được các order mà điểm tập kết gửi đi trong database chưa
    
    const maxItemsInOnePage = 5; // Phân trang, mỗi trang chỉ hiển thị tối đa 5 item
    // console.log(ordersSent);
    let cnt;
    if (ordersSent !== undefined) {
        cnt = ordersSent.length;
    }
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(0);
    const [pages, setPages] = useState([]);
    
    // Lưu các số trang vào mảng pages
    const updatePages = () => {
        let tmpPages = [];
        for(let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    };

    // Set các item trong trang thứ i vào mảng ordersSentRen để render
    const updateRenList = () => {
        // console.log(accountList);
        let tmpList;
        if (ordersSent !== undefined) {
            tmpList = ordersSent.slice(maxItemsInOnePage*(pageNum-1), maxItemsInOnePage*pageNum);
        }
        // console.log(tmpList);
        setOrdersSentRen(tmpList);
    }

    // Để get các order mà điểm tập kết gửi đi từ database
    const getOrdersSent = async () => {
        try {
            const tordersSent = await axios.get("http://localhost:8080/gathering-manager/all-orders-sent",
                {
                    params: { unit: userInfo.userInfo.uUnit }
                }
            );
            // console.log(tordersSent.data[0]);
            setOrdersSent(tordersSent.data[0]);
            // console.log(tordersSent.data[0]);
            setPageNum(1);
            updatePages();
            updateRenList();
            setIsGotOrdersSent(true);
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getOrdersSent();
    }, [isGotOrdersSent]);

    useEffect(() => {
        updateRenList();
        updatePages();
    }, [pageNum, ordersSent])

    return (
        <Fragment>
            <div className={clsx(props.className)}>
                <div className={clsx(style.container, props.className)}>
                    {ordersSentRen && ordersSentRen.length > 0 ? (
                        ordersSentRen.map((ordersSent, index) => (
                            <div className={clsx(style["sub-container"])} key={index}>
                                <div className={style["customer-container"]}>
                                    <div className={style.sender}>
                                        <div>
                                            <label>Sender Name: </label>
                                            <span>{ordersSent.customer_name}</span>
                                        </div>

                                        <div>
                                            <label>Sender Phone: </label>
                                            <span>{ordersSent.customer_phone}</span>
                                        </div>
                                    </div>

                                    <div className={clsx(style.receiver)}>
                                        <div>
                                            <label>Receiver Name: </label>
                                            <span>{ordersSent.receiver_name}</span>
                                        </div>

                                        <div>
                                            <label>Receiver Phone: </label>
                                            <span>{ordersSent.receiver_phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={clsx(style["order-container"])}>
                                    <div>
                                        <label htmlFor="Weight">Weight: </label>
                                        <span>{ordersSent.weight} kg</span>
                                    </div>

                                    <div>
                                        <label htmlFor="Price">Price: </label>
                                        <span>{ordersSent.price} VND</span>
                                    </div>

                                    <div>
                                        <label htmlFor="Date">Date: </label>
                                        <span>{ordersSent.date}</span>
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

export default StatisticOrdersSent;
