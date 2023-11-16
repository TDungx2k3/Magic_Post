import clsx from "clsx"
import style from "./TransactionList.module.scss"
import { Fragment, useState } from "react";
import Transaction from "../Transaction"
import { Link } from "react-router-dom";



function TransactionList() {
    const maxItemsInOnePage = 2;
    

    let transactionList = [
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung0",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung1",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung2",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung3",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung4",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung5",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung6",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung7",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung8",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung9",
            transactionManagerPhone: "0329579903"
        },
        {
            transactionId: "",
            transactionName: "Bac",
            transactionManagerName: "Dung10",
            transactionManagerPhone: "0329579903"
        },
    ];

    let cnt = transactionList.length;
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(1);
    let pages = [];
    for(let i = 0; i < numOfPages; i++) {
        pages.push(i+1);
    }
    return (
        <Fragment>
            <div className={clsx(style.transactionListContainer)}>
                <div className={clsx(style.functionContainer)}>
                    <div className={clsx(style.addBtn)}>
                        <i className= "ti-plus"></i>
                    </div>

                    <div className={clsx(style.searchBar)}>
                        <i className= "ti-search"></i>
                        <input type="text" placeholder="Search..."/>
                    </div>
                </div>

                {
                    transactionList.map((transaction, index) => {
                        let transactionData = {
                            transactionName: transaction.transactionName,
                            transactionManagerName: transaction.transactionManagerName,
                            transactionManagerPhone: transaction.transactionManagerPhone
                        }
                        if(index >= (pageNum-1) * maxItemsInOnePage 
                        && index < (pageNum * maxItemsInOnePage)) {
                            return(
                                <Transaction key = {index} data={transactionData}/>
                            );
                        }
                        
                    })
                }

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
                                                    setPageNum(page)
                                                }
                                            }>{page}</button>
                                        </Fragment>
                                    );
                                }
                                else if (index == pageNum && pageNum < numOfPages - 2) {
                                    return (
                                        <Fragment key={index}>
                                            <button className= {clsx(style.pageBtn, {[style.pageBtnActive] : index == pageNum -1})} onClick={
                                                ()=>{
                                                    setPageNum(page)
                                                }
                                            }>{page}</button>
                                            <span>. . .</span>
                                        </Fragment>
                                    );
                                }
                                else 
                                return(
                                    <button className= {clsx(style.pageBtn, {[style.pageBtnActive] : index == pageNum -1})} key={index} onClick={
                                        ()=>{
                                            setPageNum(page)
                                        }
                                    }>{page}</button>
                                );
                            }
                        })
                    }
                </div>
            </div>
        </Fragment>
    );
}

export default TransactionList;