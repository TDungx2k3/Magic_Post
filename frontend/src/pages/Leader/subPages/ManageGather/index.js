import { Fragment, useState, useEffect } from "react";
import Header from '../../../../components/Header'
import Footer from "../../../../components/Footer";
import PointsInfo from "../../components/PointsInfo";
import clsx from "clsx";
import style from './ManageGather.module.scss';
import TransactionList from '../../components/TransactionList';
import { useLocation } from "react-router-dom";
import axios from "axios";

function ManageGather() {

    const location = useLocation();
    const gatherId = new URLSearchParams(location.search).get("gather_id");
    console.log(gatherId);
    const [data, setData] = useState([])
    const [rerender] = useState(true);

    const getAllTransactionsWithGatherId = async(e) => {
        try {
            await axios
            .get("http://localhost:8080/leader/getAllTransactionsWithGatherId",
            {
                params:{
                    gather_id : gatherId
                }
            }
            )
            .then((res) => {
                console.log(res.data);
                setData(res.data)
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllTransactionsWithGatherId();
    }, [rerender]);

    const [manageState, setManageState] = useState(1);
    return (
        <Fragment>
            <Header/>
            <PointsInfo />
            <div className={clsx(style.content)}>
                <div className= {clsx(style.manageGatherNav)}>
                    <div className={clsx(style.transManage, {[style.active] : manageState == 1} )}
                    onClick={() => {
                        setManageState(1);
                    }}
                    >Transactions</div>
                    <div className={clsx(style.ordersManage, {[style.active] : manageState == 2})}
                    onClick={() => {
                        setManageState(2);
                    }}
                    >Orders</div>
                    <div className={clsx(style.employeesManage, {[style.active] : manageState == 3})}
                    onClick={() => {
                        setManageState(3);
                    }}
                    >Employees</div>
                </div>
                <TransactionList data = {data}/>
            </div>
            
            <Footer/>
        </Fragment>
    );
}

export default ManageGather;