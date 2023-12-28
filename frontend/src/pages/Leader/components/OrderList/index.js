import clsx from "clsx"
import style from "./OrderList.module.scss"
import { Fragment, useEffect, useState } from "react";
import Gather from "../Gather"
import { Link } from "react-router-dom";
import axios from "axios";
import Order from "../Order";


function OrderList(props) {

    const [orderReceivedList, setOrderReceivedList] = useState([]);
    const [orderSentList, setOrderSentList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [isReceive, setIsReceive] = useState(true);
    const [status, setStatus] = useState(2);
    const [rerender, setRerender] = useState(true);
    const unit = props.data;

    const maxItemsInOnePage = 5;
    let cnt = orderList.length;
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(1);
    const [pages, setPages] = useState([]);
    
    // Cập nhật phân trang
    const updatePages = () => {
        let tmpPages = [];
        for(let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    }

    // format ngày giờ
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

    // Lấy order list received
    const getOrderReceivedList = async() => {
        if(document.querySelector("." + style.dateFrom).value) {
            try {
                await axios
                .get("http://localhost:8080/leader/getOrderReceivedList",
                {
                    params: {
                        unit: unit,
                        date: document.querySelector("." + style.dateFrom).value,
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    setOrderReceivedList(res.data);
                })
            } catch (error) {
                console.log(error);
            }
        }
        else
        try {
            await axios
            .get("http://localhost:8080/leader/getOrderReceivedList",
            {
                params: {
                    unit: unit,
                    date: formatDate(new Date()),
                }
            })
            .then((res) => {
                console.log(res.data);
                setOrderReceivedList(res.data);
            })
        } catch (error) {
            console.log(error);
        }
    };

    // Lấy order list sent
    const getOrderSentList = async() => {
        if(document.querySelector("." + style.dateFrom).value) {
            try {
                await axios
                .get("http://localhost:8080/leader/getOrderSentList",
                {
                    params: {
                        unit: unit,
                        date: document.querySelector("." + style.dateFrom).value,
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    setOrderSentList(res.data);
                })
            } catch (error) {
                console.log(error);
            }
        }
        else
        try {
            await axios
            .get("http://localhost:8080/leader/getOrderSentList",
            {
                params: {
                    unit: unit,
                    date: formatDate(new Date()),
                }
            })
            .then((res) => {
                console.log(res.data);
                setOrderSentList(res.data);
            })
        } catch (error) {
            console.log(error);
        }
    };

    // Cập nhật order list
    const updateOrderList = async() => {
        console.log("o" );
        console.log(orderSentList);
        if (isReceive) {
            if(status === 0) {
                let tmpOrderList = [];
                for(let i = 0; i < orderReceivedList.length; i++) {
                    if(orderReceivedList[i].deliver_status === 1) {
                        tmpOrderList.push(orderReceivedList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
            else if(status === 1) {
                let tmpOrderList = [];
                for(let i = 0; i < orderReceivedList.length; i++) {
                    if(orderReceivedList[i].deliver_status === 0) {
                        tmpOrderList.push(orderReceivedList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
        } 
        else {
            if(status === 0) {
                let tmpOrderList = [];
                for(let i = 0; i < orderSentList.length; i++) {
                    if(orderSentList[i].deliver_status === 1) {
                        tmpOrderList.push(orderSentList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
            else if(status === 1) {
                console.log("ship");
                let tmpOrderList = [];
                for(let i = 0; i < orderSentList.length; i++) {
                    if(orderSentList[i].deliver_status === 0) {
                        tmpOrderList.push(orderSentList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
        }
        console.log(orderList);
    };

    // Cập nhật thông tin mỗi khi load trang
    useEffect(() => {
        getOrderReceivedList();
        getOrderSentList();
        updateOrderList();
    }, [rerender]);

    // Cập nhật order list khi bấm vào từng mục
    useEffect(() => {
        updateOrderList();
        console.log(orderList);
    }, [status, isReceive]);

    return (
        <Fragment>
            <div className={clsx(style.orderListContainer)}>
                <div className={clsx(style.orderNav)}>
                    <div className={clsx(style.orderReceivedNav, {[style.orderNavActive] : isReceive})}
                    onClick={() => {
                        setIsReceive(true);
                        setStatus(2);
                        setPageNum(1);
                        updateOrderList();
                    }}
                    >
                        Received Orders
                    </div>

                    <div className={clsx(style.orderSentNav, {[style.orderNavActive] : !isReceive})}
                    onClick={() => {
                        setIsReceive(false);
                        setStatus(2);
                        setPageNum(1);
                        updateOrderList();
                    }}
                    >
                        Sent Orders
                    </div>
                </div>

                <div className={clsx(style.content, {[style.contentWhenReceive] : isReceive, 
                [style.contentWhenSent] : !isReceive})}>
                    <div className={clsx(style.functionContainer)}>
                        <div className={clsx(style.dateFilter)}>
                            <input type="date" className={clsx(style.dateFrom)}/>
                            {/* <input type="date" className={clsx(style.dateTo)}/> */}
                            <div className={clsx(style.filterBtn)}
                            onClick={() => {
                                setRerender(!rerender)
                            }}
                            >Filter</div>
                        </div>

                        <div className={clsx(style.statusNav)}>
                            <div className={clsx(style.inInventoryStatus, {[style.statusNavActive] : status === 0})}
                            onClick={() => {
                                setStatus(0);
                                setPageNum(1);
                                updateOrderList();
                            }}
                            >Done</div>
                            <div className={clsx(style.shippingStatus, {[style.statusNavActive] : status === 1})}
                            onClick={() => {
                                setStatus(1);
                                setPageNum(1);
                                updateOrderList();
                            }}
                            >Shipping</div>
                        </div>
                    </div>

                    <div className={clsx(style.orderList)}>
                        {
                            orderList.map((order, index) => {
                                let orderData = {
                                    sender_name: order.customer_name,
                                    sender_phone: order.customer_phone,
                                    receiver_name: order.receiver_name,
                                    receiver_phone: order.receiver_phone,
                                    receiver_address: order.receiver_address,
                                    order_weight: order.weight,
                                    order_price: order.price,
                                    order_date: order.date,
                                };
                                if(index >= (pageNum-1) * maxItemsInOnePage 
                                && index < (pageNum * maxItemsInOnePage))
                                return(
                                    <div className={clsx(style.orderContainer)} key={index}>
                                        <Order data = {orderData} />
                                    </div>
                                );
                            })
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
                                            }
                                        }>{index + 1}</button>
                                    );
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default OrderList;