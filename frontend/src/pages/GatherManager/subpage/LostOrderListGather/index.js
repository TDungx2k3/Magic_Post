import clsx from "clsx";
import style from "./LostOrderListGather.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { LoginContext } from "../../../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LostOrderListGather() {
    const navigate = useNavigate();
    const userInfo = useContext(LoginContext)

    const [lostOrderList, setLostOrderList] = useState([]);
    const [isFetchedData, setIsFetchedData] = useState(false);

    const maxItemsInOnePage = 5;
    let cnt = lostOrderList.length;
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

    const getLostOrderList = async () => {
        try {
            const lostOrderList = await axios.get("http://localhost:8080/gathering-manager/get-lost-order-list",
                { params: { unit: userInfo.userInfo.uUnit } }
            )
            setLostOrderList(lostOrderList.data[0]);
            let tmpList = lostOrderList.data[0];
            cnt = tmpList.length;
            numOfPages = Math.ceil(cnt / maxItemsInOnePage);
            updatePages();
            setIsFetchedData(true);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getLostOrderList();
    }, [isFetchedData]);

    const handleBack = () => {
        navigate("/gather-manager");
    }

    return (
        <Fragment>
            <Header />

            <div className={clsx(style.container)}>
                {lostOrderList && lostOrderList.length > 0 ? (
                    lostOrderList.map((lostOrderList, index) => (
                        <div className={clsx(style["sub-container"])} key={index}>
                            <div className={style["customer-container"]}>
                                <div className={style.sender}>
                                    <div>
                                        <label>Sender Name: </label>
                                        <span>{lostOrderList.customer_name || "N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Sender Phone: </label>
                                        <span>{lostOrderList.customer_phone || "N/A"}</span>
                                    </div>
                                </div>

                                <div className={clsx(style.receiver)}>
                                    <div>
                                        <label>Receiver Name: </label>
                                        <span>{lostOrderList.receiver_name || "N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Receiver Phone: </label>
                                        <span>{lostOrderList.receiver_phone || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx(style["order-container"])}>
                                <div>
                                    <label htmlFor="Weight">Weight: </label>
                                    <span>{lostOrderList.weight || "N/A"} kg</span>
                                </div>

                                <div>
                                    <label htmlFor="Price">Price: </label>
                                    <span>{lostOrderList.price || "N/A"} $</span>
                                </div>

                                <div>
                                    <label htmlFor="Date">Date: </label>
                                    <span>{lostOrderList.date || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    )
                    )) :
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

            <button onClick={handleBack} className={clsx(style.back)}>
                Back
            </button>

            <Footer />
        </Fragment>
    )
}

export default LostOrderListGather;
