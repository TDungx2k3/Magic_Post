import clsx from "clsx";
import style from "./StatisticOrdersReceived.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../../../App";

function StatisticOrdersReceived(props) {
    const userInfo = useContext(LoginContext);

    const [ordersReceived, setOrdersReceived] = useState([]);
    const [ordersReceivedRen, setOrdersReceivedRen] = useState([]);
    const [isGotOrdersReceived, setIsGotOrdersReceived] = useState(false);

    const maxItemsInOnePage = 5;
    let cnt = ordersReceived.length;
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(0);
    const [pages, setPages] = useState([]);
    
    const updatePages = () => {
        let tmpPages = [];
        for(let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    };

    const updateRenList = () => {
        // console.log(accountList);
        let tmpList = ordersReceived.slice(maxItemsInOnePage*(pageNum-1), maxItemsInOnePage*pageNum);
        // console.log(tmpList);
        setOrdersReceivedRen(tmpList);
    }

    const getOrdersReceived = async () => {
        try {
            const tordersReceived = await axios.get("http://localhost:8080/gathering-manager/all-orders-received",
                {
                    params: { unit: userInfo.userInfo.uUnit }
                }
            );
            setOrdersReceived(tordersReceived.data[0]);
            console.log(tordersReceived.data[0]);
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
                                            <span>{ordersReceived.customer_name || "N/A"}</span>
                                        </div>

                                        <div>
                                            <label>Sender Phone: </label>
                                            <span>{ordersReceived.customer_phone || "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className={clsx(style.receiver)}>
                                        <div>
                                            <label>Receiver Name: </label>
                                            <span>{ordersReceived.receiver_name || "N/A"}</span>
                                        </div>

                                        <div>
                                            <label>Receiver Phone: </label>
                                            <span>{ordersReceived.receiver_phone || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={clsx(style["order-container"])}>
                                    <div>
                                        <label htmlFor="Weight">Weight: </label>
                                        <span>{ordersReceived.weight || "N/A"} kg</span>
                                    </div>

                                    <div>
                                        <label htmlFor="Price">Price: </label>
                                        <span>{ordersReceived.price || "N/A"} $</span>
                                    </div>

                                    <div>
                                        <label htmlFor="Date">Date: </label>
                                        <span>{ordersReceived.date || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={clsx(style["sub-container"])}>
                            <div className={style["customer-container"]}>
                                <div className={style.sender}>
                                    <div>
                                        <label>Sender Name: </label>
                                        <span>{"N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Sender Phone: </label>
                                        <span>{"N/A"}</span>
                                    </div>
                                </div>

                                <div className={clsx(style.receiver)}>
                                    <div>
                                        <label>Receiver Name: </label>
                                        <span>{"N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Receiver Phone: </label>
                                        <span>{"N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx(style["order-container"])}>
                                <div>
                                    <label htmlFor="Weight">Weight: </label>
                                    <span>{"N/A"} kg</span>
                                </div>

                                <div>
                                    <label htmlFor="Price">Price: </label>
                                    <span>{"N/A"} $</span>
                                </div>

                                <div>
                                    <label htmlFor="Date">Date: </label>
                                    <span>{"N/A"}</span>
                                </div>
                            </div>
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
