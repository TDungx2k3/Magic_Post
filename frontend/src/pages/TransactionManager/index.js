import clsx from "clsx";
import style from "./TransactionManager.module.scss";
import { Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import TransactionManagerFormCreateAccount from "./component/TransactionManagerFormCreateAccount";
import StatisticOrdersSent from "./component/StatisticOrdersSent";
import StatisticOrdersReceived from "./component/StatisticOrdersReceived";
import ManageTransaction from "./component/ManageTransaction";
import Footer from "../../components/Footer";

function TransactionManager() {
    const [isClickCreateAccount, setIsClickCreateAccount] = useState(true);
    const [isClickStatisticOrdersSent, setIsClickStatisticOrdersSent] = useState(false);
    const [isClickStatisticOrdersReceived, setIsClickStatisticOrdersReceived] = useState(false);

    const handleIsClickCreateAccount = () => {
        setIsClickCreateAccount(true);
        if (isClickStatisticOrdersSent === true) {
            setIsClickStatisticOrdersSent(false);
        }
        if (isClickStatisticOrdersReceived === true) {
            setIsClickStatisticOrdersReceived(false);
        }
    };

    const handleIsClickStatisticOrdersSent = () => {
        setIsClickStatisticOrdersSent(true);
        if (isClickCreateAccount === true) {
            setIsClickCreateAccount(false);
        }
        if (isClickStatisticOrdersReceived === true) {
            setIsClickStatisticOrdersReceived(false);
        }
    }

    const handleIsClickStatisticOrdersReceived = () => {
        setIsClickStatisticOrdersReceived(true);
        if (isClickCreateAccount === true) {
            setIsClickCreateAccount(false);
        }
        if (isClickStatisticOrdersSent === true) {
            setIsClickStatisticOrdersSent(false);
        }
    }

    console.log("create: " + isClickCreateAccount);
    console.log("statistic: " + isClickStatisticOrdersSent);

    return (
        <Fragment>
            <Header />
            <ManageTransaction 
                onClickCreateAccount={handleIsClickCreateAccount} 
                onClickStatisticOrdersSent={handleIsClickStatisticOrdersSent}
                onClickStatisticOrdersReceived={handleIsClickStatisticOrdersReceived}
            />
            <TransactionManagerFormCreateAccount 
                className={clsx({[style["transaction-manager-form-create-account"]] : isClickCreateAccount === true}, {[style["transaction-manager-form-create-account-hidden"]] : isClickCreateAccount === false})}
            />
            <StatisticOrdersSent 
                className={clsx({[style["statistic-orders-sent"]] : isClickStatisticOrdersSent === true}, {[style["statistic-orders-sent-hidden"]] : isClickStatisticOrdersSent === false})}
            />
            <StatisticOrdersReceived 
                className={clsx({[style["statistic-orders-received"]] : isClickStatisticOrdersReceived === true}, {[style["statistic-orders-sent-hidden"]] : isClickStatisticOrdersReceived === false})}   
            />
            <Footer />
        </Fragment>
    );
}

export default TransactionManager;
