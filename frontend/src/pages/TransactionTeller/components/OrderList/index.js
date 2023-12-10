import clsx from "clsx"
import style from "./OrderList.module.scss"
import { Fragment, createContext, useEffect, useState } from "react";
import axios from "axios";
import Order from "../Order";

export const OrderListStatusContext = createContext();

function OrderList(props) {

    const [allOrdersList, setAllOrdersList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [status, setStatus] = useState(-1);
    const [rerender] = useState(true);
    const unit = props.data.unit;
    const isTo = props.data.status;

    const maxItemsInOnePage = 5;
    let cnt = orderList.length;
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(1);
    const [pages, setPages] = useState([]);
    
    const updatePages = () => {
        let tmpPages = [];
        for(let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    }

    function Date(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

    const getAllOrders = async() => {
        if(isTo) {
            try {
                await axios
                .get("http://localhost:8080/transTeller/getToCustomerOrder",
                {
                    params: {
                        unit: unit,
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    setAllOrdersList(res.data);
                    setStatus(0);
                })
            } catch (error) {
                console.log(error);
            }
        }   
        else {
            try {
                
                await axios
                .get("http://localhost:8080/transTeller/getFromCustomerOrder",
                {
                    params: {
                        unit: unit,
                    }
                })
                .then((res) => {
                    // console.log(res.data);
                    setAllOrdersList(res.data);
                    setStatus(1);
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const updateOrderList = () => {
        if (isTo) {
            if(status === 0) {
                let tmpOrderList = [];
                for(let i = 0; i < allOrdersList.length; i++) {
                    if(allOrdersList[i].steps === 5) {
                        tmpOrderList.push(allOrdersList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
            else if(status === 1) {
                let tmpOrderList = [];
                for(let i = 0; i < allOrdersList.length; i++) {
                    if(allOrdersList[i].steps === 6) {
                        tmpOrderList.push(allOrdersList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
            else if(status === 2) {
                let tmpOrderList = [];
                for(let i = 0; i < allOrdersList.length; i++) {
                    if(allOrdersList[i].steps === 7) {
                        tmpOrderList.push(allOrdersList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
        } else {
            if(status === 1) {
                let tmpOrderList = [];
                for(let i = 0; i < allOrdersList.length; i++) {
                    if(allOrdersList[i].steps === 0) {
                        tmpOrderList.push(allOrdersList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
            else if(status === 2) {
                let tmpOrderList = [];
                for(let i = 0; i < allOrdersList.length; i++) {
                    if(allOrdersList[i].steps === 1) {
                        tmpOrderList.push(allOrdersList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
        }
    };

    useEffect(() => {
        getAllOrders();
        updateOrderList();
    }, [rerender]);

    useEffect(() => {
        
        updateOrderList();
    }, [status]);

    const updateFr = (i) => {
        console.log(i);
        let tmp = allOrdersList;
        tmp[i].steps = tmp[i].steps + 1;
        setAllOrdersList(tmp);
        setRe(!re);
    }

    const [re, setRe] = useState(true);

    useEffect(() => {
        console.log(1);
        updateOrderList();
    }, [re]);

    return (
        <Fragment>
            <div className={clsx(style.orderListContainer)}>
                

                <div className={clsx(style.content,)}>
                    <div className={clsx(style.functionContainer)}>

                        <div className={clsx(style.filterContainer)}>
                            <div className={clsx(style.searchContainer)}>
                                <input type="text" className={clsx(style.searchID)} placeholder="Order ID" />
                                <input type="text" className={clsx(style.searchPhone)} placeholder="Phone Number" />
                            </div>

                            <div className={clsx(style.filterDate)}>
                                <input type="date" className={clsx(style.dateFrom)} />
                                <input type="date" className={clsx(style.dateTo)} />
                            </div>

                            <div className={clsx(style.searchBtn)}>Search</div>
                        </div>

                        <div className={clsx(style.statusNav)}>
                            <div className={clsx(style.confirmStatus, {[style.statusNavActive] : (status === 0), [style.hidden] : !isTo})}
                            onClick={() => {
                                setStatus(0);
                                // updateOrderList();
                            }}
                            >Comfirmation</div>
                            <div className={clsx(style.inInventoryStatus, {[style.statusNavActive] : status === 1, [style.addBorderRadius] : !isTo})}
                            onClick={() => {
                                setStatus(1);
                                // updateOrderList();
                            }}
                            >In inventory</div>
                            <div className={clsx(style.shippingStatus, {[style.statusNavActive] : status === 2})}
                            onClick={() => {
                                setStatus(2);
                                // updateOrderList();
                            }}
                            >Shipping</div>
                        </div>
                    </div>

                    <div className={clsx({[style.hidden] : orderList.length !== 0})}>There are no valid orders</div>

                    <div className={clsx(style.orderList)}>
                        {
                            orderList.map((order, index) => {
                                let orderData = {
                                    order_id: order.order_id,
                                    order_unit: order.order_status,
                                    sender_name: order.customer_name,
                                    sender_phone: order.customer_phone,
                                    receiver_name: order.receiver_name,
                                    receiver_phone: order.receiver_phone,
                                    receiver_address: order.receiver_address,
                                    order_weight: order.weight,
                                    order_price: order.price,
                                    order_date: order.deliveries[0].date,
                                    status: order.steps,
                                };
                                if(index >= (pageNum-1) * maxItemsInOnePage 
                                && index < (pageNum * maxItemsInOnePage))
                                return(
                                    <OrderListStatusContext.Provider value={{updateFr, status}} key={index}>
                                        <div className={clsx(style.orderContainer)}>
                                            <Order data = {orderData} addition={index}/>
                                        </div>
                                    </OrderListStatusContext.Provider>
                                    
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