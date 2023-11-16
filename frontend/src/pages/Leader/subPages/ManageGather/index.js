import { Fragment } from "react";
import Header from '../../../../components/Header'
import Footer from "../../../../components/Footer";
import PointsInfo from "../../components/PointsInfo";
import clsx from "clsx";
import style from './ManageGather.module.scss';
import TransactionList from '../../components/TransactionList';

function ManageGather() {
    return (
        <Fragment>
            <Header/>
            <PointsInfo />
            <div className={clsx(style.content)}>
                <div className= {clsx(style.manageGatherNav)}>
                    <div className={clsx(style.transManage)}>Transactions</div>
                    <div className={clsx(style.ordersManage)}>Orders</div>
                    <div className={clsx(style.employeesManage)}>Employees</div>
                </div>
                <TransactionList/>
            </div>
            
            <Footer/>
        </Fragment>
    );
}

export default ManageGather;