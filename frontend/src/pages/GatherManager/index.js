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
import { Link } from "react-router-dom";

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

            <div className={clsx(style.exception)}>
                <div className={clsx(style["customer-deny"])}>
                    <Link to={"/gather-manager/deny-list"}>
                        <button>Customers Deny Order</button>
                    </Link>
                </div>

                <div className={clsx(style["lost-orders"])}>
                    <Link to={"/gather-manager/lost-order-list"}>
                        <button>Lost Orders</button>
                    </Link>
                </div>
            </div>

            <Link to="/gather-manager/statistic">
                <div className={clsx(style.statistic)}>
                    <button>Statistic</button>
                </div>
            </Link>

            <Link to='/gather-manager/create-account' className={clsx(style.addBtn)}>
                <i className="ti-plus"></i>
            </Link>

            <ManageGatherNav
                onClickManageAccountEmployee={handleIsClickManageAccountEmployee}
                onClickStatisticOrdersSent={handleIsClickStatisticOrdersSent}
                onClickStatisticOrdersReceived={handleIsClickStatisticOrdersReceived}
            />
            <div>

            </div>
            <ManageAccountEmployee
                className={clsx({ [style["manage-account-employee"]]: isClickManageAccountEmployee === true }, { [style["manage-account-employee-hidden"]]: isClickManageAccountEmployee === false })}
            />
            <StatisticOrdersSent
                className={clsx({ [style["statistic-orders-sent"]]: isClickStatisticOrdersSent === true }, { [style["statistic-orders-sent-hidden"]]: isClickStatisticOrdersSent === false })}
            />
            <StatisticOrdersReceived
                className={clsx({ [style["statistic-orders-received"]]: isClickStatisticOrdersReceived === true }, { [style["statistic-orders-received-hidden"]]: isClickStatisticOrdersReceived === false })}
            />
            <Footer />
        </Fragment>
    )
}

export default GatherManager;
