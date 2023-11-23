import clsx from "clsx";
import style from "./GatherManager.module.scss";
import Header from "../../components/Header";
import ManageGatherNav from "./component/ManageGatherNav";
import ManageAccountEmployee from "./component/ManageAccountEmpoyee";
import StatisticOrdersSent from "./component/StatisticOrdersSent";
import StatisticOrdersReceived from "./component/StatisticOrdersReceived";
import Footer from "../../components/Footer";
import { Fragment } from "react";
import { useState } from "react";

function GatherManager() {
    const [isClickManageAccountEmployee, setIsClickManageAccountEmployee] = useState(true);
    const [isClickStatisticOrdersSent, setIsClickStatisticOrdersSent] = useState(false);
    const [isClickStatisticOrdersReceived, setIsClickStatisticOrdersReceived] = useState(false);

    const handleIsClickManageAccountEmployee = () => {
        setIsClickManageAccountEmployee(true);
        if (isClickStatisticOrdersSent === true) {
            setIsClickStatisticOrdersSent(false);
        }
        if (isClickStatisticOrdersReceived === true) {
            setIsClickStatisticOrdersReceived(false);
        }
    };

    const handleIsClickStatisticOrdersSent = () => {
        setIsClickStatisticOrdersSent(true);
        if (isClickManageAccountEmployee === true) {
            setIsClickManageAccountEmployee(false);
        }
        if (isClickStatisticOrdersReceived === true) {
            setIsClickStatisticOrdersReceived(false);
        }
    }

    const handleIsClickStatisticOrdersReceived = () => {
        setIsClickStatisticOrdersReceived(true);
        if (isClickManageAccountEmployee === true) {
            setIsClickManageAccountEmployee(false);
        }
        if (isClickStatisticOrdersSent === true) {
            setIsClickStatisticOrdersSent(false);
        }
    }

    return (
        <Fragment>
            <Header />
            <ManageGatherNav 
                onClickManageAccountEmployee={handleIsClickManageAccountEmployee} 
                onClickStatisticOrdersSent={handleIsClickStatisticOrdersSent}
                onClickStatisticOrdersReceived={handleIsClickStatisticOrdersReceived}
            />
            <ManageAccountEmployee
                className={clsx({[style["manage-account-employee"]] : isClickManageAccountEmployee === true}, {[style["manage-account-employee-hidden"]] : isClickManageAccountEmployee === false})}
            />
            <StatisticOrdersSent 
                className={clsx({[style["statistic-orders-sent"]] : isClickStatisticOrdersSent === true}, {[style["statistic-orders-sent-hidden"]] : isClickStatisticOrdersSent === false})}
            />
            <StatisticOrdersReceived 
                className={clsx({[style["statistic-orders-received"]] : isClickStatisticOrdersReceived === true}, {[style["statistic-orders-received-hidden"]] : isClickStatisticOrdersReceived === false})}
            />
            <Footer />
        </Fragment>
    )
}

export default GatherManager;
