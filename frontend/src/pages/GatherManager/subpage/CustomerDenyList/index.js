import clsx from "clsx";
import style from "./CustomerDenyList.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import axios from "axios";
import { LoginContext } from "../../../../App";
import { useNavigate } from "react-router-dom";

function CustomerDenyList() {
    const navigate = useNavigate();
    const userInfo = useContext(LoginContext);

    const [denyList, setDenyList] = useState([]); // Lưu danh sách các khách hàng từ chối nhận hàng
    const [denyRenList, setDenyRenList] = useState([]); // Lưu danh sách các khách hàng từ chối nhận hàng trong trang thứ i
    const [isFetchedData, setIsFetchedData] = useState(false); // Check xem đã get được dữ liệu khách hàng deny từ data base chưa

    const maxItemsInOnePage = 5;
    let cnt = denyList.length;
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(0);
    const [pages, setPages] = useState([]);
    
    // Set các trang vào mảng pages
    const updatePages = () => {
        let tmpPages = [];
        for(let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    };

    // Cập nhật danh sách các khách từ chối nhận hàng trong trang thứ i
    const updateDenyRenList = () => {
        let tmpDenyList = denyList.slice(maxItemsInOnePage*(pageNum - 1), pageNum*maxItemsInOnePage);
        setDenyRenList(tmpDenyList);
    }

    // Get danh sách các khách hàng từ chối nhận hàng
    const getDenyList = async () => {
        try {
            const denyOList = await axios.get("http://localhost:8080/gathering-manager/get-customer-deny-list",
                {
                    params: { unit: userInfo.userInfo.uUnit }
                });
            setDenyList(denyOList.data[0]);
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

    // Bấm nút back thì chuyển về trang gather-manager
    const handleBack = () => {
        navigate("/gather-manager");
    }

    return (
        <Fragment>
            <Header />

            <div className={clsx(style.container)}>
                {denyRenList && denyRenList.length > 0 ? (
                    denyRenList.map((denyRenList, index) => (
                        <div className={clsx(style["sub-container"])} key={index}>
                            <div className={style["customer-container"]}>
                                <div className={style.sender}>
                                    <div>
                                        <label>Sender Name: </label>
                                        <span>{denyRenList.customer_name}</span>
                                    </div>

                                    <div>
                                        <label>Sender Phone: </label>
                                        <span>{denyRenList.customer_phone}</span>
                                    </div>
                                </div>

                                <div className={clsx(style.receiver)}>
                                    <div>
                                        <label>Receiver Name: </label>
                                        <span>{denyRenList.receiver_name}</span>
                                    </div>

                                    <div>
                                        <label>Receiver Phone: </label>
                                        <span>{denyRenList.receiver_phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx(style["order-container"])}>
                                <div>
                                    <label htmlFor="Weight">Weight: </label>
                                    <span>{denyRenList.weight} kg</span>
                                </div>

                                <div>
                                    <label htmlFor="Price">Price: </label>
                                    <span>{denyRenList.price} VND</span>
                                </div>

                                <div>
                                    <label htmlFor="Date">Date: </label>
                                    <span>{denyRenList.date}</span>
                                </div>
                            </div>
                        </div>
                    )
                    )) :
                    (
                        <div id={clsx(style["no-account"])}>There are no valid accounts</div>
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
                                        <button className= {clsx(style.pageBtn, {[style.pageBtnActive] : index == pageNum -1})} onClick={
                                            ()=>{
                                                setPageNum(index + 1)
                                                updateDenyRenList();
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
                                        updateDenyRenList();
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

export default CustomerDenyList;
