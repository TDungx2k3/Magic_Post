import clsx from "clsx";
import style from "./StatisticOrdersReceived.module.scss";
import { useEffect, useState, useContext, Fragment } from "react";
import axios from "axios";
import { LoginContext } from "../../../../App";

function StatisticOrdersReceived(props) {
    const [data, setData] = useState([]); // Mảng để lưu các đơn hàng mà điểm giao dịch nhận
    const [dataRen, setDataRen] = useState([]); // Mảng để lưu các đơn hàng sẽ render trong trang thứ i
    const { userInfo } = useContext(LoginContext);

    const [isFetchedData, setIsFetchedData] = useState(false); // Check xem đã get được data các đơn hàng mà điểm giao dịch nhận chưa

    const maxItemsInOnePage = 5; // Số lượng đơn hàng được render trong 1 trang tối đa là 5
    let cnt = 0;
    if (data !== undefined) {
        cnt = data.length;
    }
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
    };

    // Lưu các đơn hàng sẽ render trong trang thứ i vào mảng dataRen
    const updateRenList = () => {
        // console.log(accountList);
        let tmpList;
        if (data !== undefined) {
            tmpList = data.slice(maxItemsInOnePage*(pageNum-1), maxItemsInOnePage*pageNum);
        }
        // console.log(tmpList);
        setDataRen(tmpList);
    }

    // Get tất cả các đơn hàng mà điểm giao dịch đã nhận
    const handleGetData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/transaction-manager/get-order-received",
                {
                    params: { unit: userInfo.uUnit }
                }
            );
            setData(response.data[0]);
            // console.log(response.data[0]);
            setPageNum(1);
            updatePages();
            updateRenList();
            setIsFetchedData(true);
        } catch (err) {
            console.error(err);
        }
    };

    // console.log(data);

    useEffect(() => {
        handleGetData();
    }, [isFetchedData]);

    useEffect(() => {
        updateRenList();
        updatePages();
    }, [pageNum, data])

    // console.log(data);

    return (
        <Fragment>
            <div className={clsx(props.className)}>
                <div className={clsx(style.container, props.className)}>
                    {dataRen && dataRen.length > 0 ? (
                        dataRen.map((data, index) => (
                            <div className={clsx(style["sub-container"])} key={index}>
                                <div className={style["customer-container"]}>
                                    <div className={style.sender}>
                                        <div>
                                            <label>Sender Name: </label>
                                            <span>{data.customer_name}</span>
                                        </div>

                                        <div>
                                            <label>Sender Phone: </label>
                                            <span>{data.customer_phone}</span>
                                        </div>
                                    </div>

                                    <div className={clsx(style.receiver)}>
                                        <div>
                                            <label>Receiver Name: </label>
                                            <span>{data.receiver_name}</span>
                                        </div>

                                        <div>
                                            <label>Receiver Phone: </label>
                                            <span>{data.receiver_phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={clsx(style["order-container"])}>
                                    <div>
                                        <label htmlFor="Weight">Weight: </label>
                                        <span>{data.weight} kg</span>
                                    </div>

                                    <div>
                                        <label htmlFor="Price">Price: </label>
                                        <span>{data.price} VND</span>
                                    </div>

                                    <div>
                                        <label htmlFor="Date">Date: </label>
                                        <span>{data.date}</span>
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
