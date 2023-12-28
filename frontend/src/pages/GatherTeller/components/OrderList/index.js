import clsx from "clsx"
import style from "./OrderList.module.scss"
import { Fragment, createContext, useEffect, useState } from "react";
import axios, { all } from "axios";
import Order from "../Order";

export const OrderListStatusContext = createContext();

function OrderList(props) {
    
    const [re, setRe] = useState(true);
    const [allOrdersList, setAllOrdersList] = useState([]); // Tập tất cả các order liên quan đến gather
    const [orderList, setOrderList] = useState([]); // Tập các order hiển thị ra
    const [status, setStatus] = useState(-1); // Điều hướng navigation
    const [rerender] = useState(true);
    const unit = props.data.unit;
    const isTo = props.data.status;

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

    // Format Date
    function Date(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

    // Lấy tất cả đơn hàng đến hoặc đi khỏi điểm giao dịch
    const getAllOrders = async() => {
        if(isTo) {
            try {
                await axios
                .get("http://localhost:8080/gatherTeller/getToTransactionOrder",
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
                .get("http://localhost:8080/gatherTeller/getFromTransactionOrder",
                {
                    params: {
                        unit: unit,
                    }
                })
                .then((res) => {
                    // console.log(res.data);
                    setAllOrdersList(res.data);
                    setStatus(0);
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    // Update những order hiện thị ra khi chọn trang khác
    const updateOrderList = () => {
        if (isTo) {
            if(status === 0) {
                let tmpOrderList = [];
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
                for(let i = 0; i < allOrdersList.length; i++) {
                    if(allOrdersList[i].steps === 3 && allOrdersList[i].order_status !== storedUserInfo.uUnit) {
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
                    if(allOrdersList[i].steps === 4) {
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
                    if(allOrdersList[i].steps === 5) {
                        tmpOrderList.push(allOrdersList[i]);
                    }
                }
                cnt = tmpOrderList.length;
                numOfPages = Math.ceil(cnt / maxItemsInOnePage);
                updatePages();
                setOrderList(tmpOrderList);
            }
        } else {
            if(status === 0) {
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
            else if(status === 1) {
                let tmpOrderList = [];
                for(let i = 0; i < allOrdersList.length; i++) {
                    if(allOrdersList[i].steps === 2) {
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
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
                for(let i = 0; i < allOrdersList.length; i++) {
                    if(allOrdersList[i].steps === 3 && allOrdersList[i].order_status === storedUserInfo.uUnit) {
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

    // Tìm kiếm đơn hàng theo ID hoặc customer's phone
    const handleSearch = () => {
        let oIdInp = document.querySelector("." + style.searchID).value;
        let phoneInp = document.querySelector("." + style.searchPhone).value;
        let tmpOrderList = [];
        if(oIdInp !== "") {
        // console.log(12);
            for(let i = 0; i < allOrdersList.length; i++) {
                // console.log(allOrdersList[i].order_id == oIdInp);
                if(allOrdersList[i].order_id == oIdInp) {
                    tmpOrderList.push(allOrdersList[i]);
                }
            }
        }
        else {
            // console.log(allOrdersList);
            tmpOrderList = allOrdersList.slice();
            // console.log(tmpOrderList);
        }

        if(phoneInp !== "") {
            for(let i = 0; i < tmpOrderList.length; i++) {
                
                if(!tmpOrderList[i].customer_phone.includes(phoneInp)
                && !tmpOrderList[i].receiver_phone.includes(phoneInp)) {
                    tmpOrderList.splice(i, 1);
                    i--;
                }
            }
        }

        setOrderList(tmpOrderList);
        // setRe(!re);
    }

    // Cập nhật order list
    useEffect(() => {
        getAllOrders();
        updateOrderList();
    }, [rerender]);

    // Cập nhật order list theo từng trang
    useEffect(() => {
        
        updateOrderList();
    }, [status]);

    // Update frontend biến mất order khi bấm vào lost order
    const updateFrLost = (id) => {
        let tmp = allOrdersList;
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        for(let i = 0; i < tmp.length; i++) {
            if(tmp[i].order_id === id) {
                tmp.splice(i,1);
                break;
            }
        }
        console.log(tmp);
        setAllOrdersList(tmp);
        setRe(!re);
    }

    // Update frontend biến mất order khi bấm vào move hoặc confirm
    const updateFr = (id) => {
        console.log(id);
        let tmp = allOrdersList;
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        for(let i = 0; i < tmp.length; i++) {
            if(tmp[i].order_id === id) {
                tmp[i].steps = tmp[i].steps + 1;
                tmp[i].order_status = storedUserInfo.uUnit;
                break;
            }
        }
        console.log(tmp);
        setAllOrdersList(tmp);
        setRe(!re);
    }


    // Cập nhật order list
    useEffect(() => {
        // console.log(1);
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

                            <div className={clsx(style.searchBtn)}
                            onClick={handleSearch}>Search</div>
                        </div>

                        <div className={clsx(style.statusNav)}>
                            <div className={clsx(style.confirmStatus, {[style.statusNavActive] : (status === 0)})}
                            onClick={() => {
                                setStatus(0);
                                setPageNum(1);
                                document.querySelector("." + style.searchID).value = "";
                                document.querySelector("." + style.searchPhone).value = "";
                                // updateOrderList();
                            }}
                            >Comfirmation</div>
                            <div className={clsx(style.inInventoryStatus, {[style.statusNavActive] : status === 1})}
                            onClick={() => {
                                setStatus(1);
                                setPageNum(1);
                                document.querySelector("." + style.searchID).value = "";
                                document.querySelector("." + style.searchPhone).value = "";
                                // updateOrderList();
                            }}
                            >In inventory</div>
                            <div className={clsx(style.shippingStatus, {[style.statusNavActive] : status === 2})}
                            onClick={() => {
                                setStatus(2);
                                setPageNum(1);
                                document.querySelector("." + style.searchID).value = "";
                                document.querySelector("." + style.searchPhone).value = "";
                                // updateOrderList();
                            }}
                            >Shipping</div>
                        </div>
                    </div>

                    <div className={clsx({[style.hidden] : orderList.length !== 0})}>There are no valid orders</div>

                    <div className={clsx(style.orderList)}>
                        {
                            orderList.map((order, index) => {
                                let rAddress = order.receiver_address.split('#')[0];
                                
                                let orderData = {
                                    order_id: order.order_id,
                                    order_unit: order.order_status,
                                    sender_name: order.customer_name,
                                    sender_phone: order.customer_phone,
                                    receiver_name: order.receiver_name,
                                    receiver_phone: order.receiver_phone,
                                    receiver_address: rAddress,
                                    order_weight: order.weight,
                                    order_price: order.price,
                                    order_date: order.deliveries[0].date,
                                    status: order.steps,
                                    max_delivery: order.deliveries[order.deliveries.length-1].deliver_id,
                                };
                                if(index >= (pageNum-1) * maxItemsInOnePage 
                                && index < (pageNum * maxItemsInOnePage))
                                return(
                                    <OrderListStatusContext.Provider value={{updateFr, updateFrLost, status}} key={index}>
                                        <div className={clsx(style.orderContainer)}>
                                            <Order data = {orderData} addition={order.order_id} isTo={isTo}/>
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