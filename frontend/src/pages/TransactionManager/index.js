import clsx from "clsx";
import style from "./TransactionManager.module.scss";
import { Fragment, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../App";
import Header from "../../components/Header";
import TransactionManagerFormCreateAccount from "./component/TransactionManagerFormCreateAccount";
import StatisticOrdersSent from "./component/StatisticOrdersSent";
import StatisticOrdersReceived from "./component/StatisticOrdersReceived";
import ManageTransactionNav from "./component/ManageTransactionNav";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

function TransactionManager() {
    const navigate = useNavigate();
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    let cnt = 0;
    useEffect(() => {
        if (!storedIsLogin && nowTime - storedOutTime < 3600000 && cnt === 0) {
            cnt++;
            alert("You have to login before access this page!");
            navigate("/login");
        }
    }, [1])

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

    return (
        <Fragment>
            <Header />
            <div className={clsx(style.exception)}>
                <div className={clsx(style["customer-deny"])}>
                    <Link to={"/transaction-manager/deny-list"}>
                        <button>Customers Deny Order</button>
                    </Link>
                </div>

                <div className={clsx(style["lost-orders"])}>
                    <Link to={"/transaction-manager/lost-order-list"}>
                        <button>Lost Orders</button>
                    </Link>
                </div>
            </div>

            <Link to="/transaction-manager/statistic">
                <div className={clsx(style.statistic)}>
                    <button>Statistic</button>
                </div>
            </Link>

            <ManageTransactionNav
                onClickCreateAccount={handleIsClickCreateAccount}
                onClickStatisticOrdersSent={handleIsClickStatisticOrdersSent}
                onClickStatisticOrdersReceived={handleIsClickStatisticOrdersReceived}
            />
            <TransactionManagerFormCreateAccount
                className={clsx({ [style["transaction-manager-form-create-account"]]: isClickCreateAccount === true }, { [style["transaction-manager-form-create-account-hidden"]]: isClickCreateAccount === false })}
            />
            <StatisticOrdersSent
                className={clsx({ [style["statistic-orders-sent"]]: isClickStatisticOrdersSent === true }, { [style["statistic-orders-sent-hidden"]]: isClickStatisticOrdersSent === false })}
            />
            <StatisticOrdersReceived
                className={clsx({ [style["statistic-orders-received"]]: isClickStatisticOrdersReceived === true }, { [style["statistic-orders-sent-hidden"]]: isClickStatisticOrdersReceived === false })}
            />
            <Footer />
        </Fragment>
    );
}

export default TransactionManager;
