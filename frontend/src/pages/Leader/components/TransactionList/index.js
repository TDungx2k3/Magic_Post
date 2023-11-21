import clsx from "clsx"
import style from "./TransactionList.module.scss"
import { Fragment, useState } from "react";
import Transaction from "../Transaction"
import { Link } from "react-router-dom";



function TransactionList(props) {
    const maxItemsInOnePage = 5;
    let transactionList = props.data;
    transactionList.sort((a, b) => {
        const nameA = a.trans_name.toUpperCase();
        const nameB = b.trans_name.toUpperCase();

        if (nameA < nameB) {
            return -1;
        } else if (nameA > nameB) {
            return 1;
        } else {
            return 0;
        }
    });
    // console.log(transactionList);
    // console.log(transactionList);
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
                            transactionName: transaction.trans_name,
                            transactionManagerName: transaction.account.account_name,
                            transactionManagerPhone: transaction.account.account_phone
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