import clsx from "clsx";
import style from "./ManageTransactionNav.module.scss";
import { useState } from "react";

function ManageTransactionNav({ onClickCreateAccount, onClickStatisticOrdersSent, onClickStatisticOrdersReceived }) {
    // Handle click nav Create Account
    const handleCreateAccountClick = () => {
        if (onClickCreateAccount) {
            onClickCreateAccount();
        }
    };

    // Handle click nav Statistic Orders Sent
    const handleStatisticOrdersSentClick = () => {
        if (onClickStatisticOrdersSent) {
            onClickStatisticOrdersSent();
        }
    }

    // Handle click nav Statistic Orders Received
    const handleStatisticOrdersReceivedClick = () => {
        if (onClickStatisticOrdersReceived) {
            onClickStatisticOrdersReceived();
        }
    }

    const [isClickCreateAccount, setIsClickCreateAccount] = useState(true); // Check xem có bấm vào nav Create Account không, default là true để khi vào trang default hiển thị ra form create account
    const [isClickStatisticOrdersSent, setIsClickStatisticOrdersSent] = useState(false); // Check xem có bấm vào nav Statistic Orders Sent không
    const [isClickStatisticOrdersReceived, setIsClickStatisticOrdersReceived] = useState(false); // Chekc xem có bấm vào nav Statistic Orders Received không

    const handleIsClickCreateAccount = () => {
        setIsClickCreateAccount(true);
        setIsClickStatisticOrdersSent(false);
        setIsClickStatisticOrdersReceived(false);
    }

    const handleIsClickStatisticOrdersSent = () => {
        setIsClickStatisticOrdersSent(true);
        setIsClickCreateAccount(false);
        setIsClickStatisticOrdersReceived(false);
    }

    const handleIsClickStatisticOrdersReceived = () => {
        setIsClickStatisticOrdersReceived(true);
        setIsClickStatisticOrdersSent(false);
        setIsClickCreateAccount(false);
    }

    const handleOnClickCreateAccount = () => {
        handleCreateAccountClick();
        handleIsClickCreateAccount();
    }

    const handleOnClickStatisticOrdersSent = () => {
        handleStatisticOrdersSentClick();
        handleIsClickStatisticOrdersSent();
    }

    const handleOnClickStatisticOrdersReceived = () => {
        handleStatisticOrdersReceivedClick();
        handleIsClickStatisticOrdersReceived();
    }

    return (
        <div className={clsx(style.content)}>
            <div className={clsx(style.manageForTransactionManagerNav)}>
                <div 
                    className={isClickCreateAccount ? clsx(style["create-account-active"]) : clsx(style["create-account"])} 
                    onClick={handleOnClickCreateAccount}
                >
                    Create Account
                </div>

                <div 
                    className={isClickStatisticOrdersSent ? clsx(style["statistic-sent-active"]) : clsx(style["statistic-sent"])} 
                    onClick={handleOnClickStatisticOrdersSent}
                >
                    Statistic Orders Sent
                </div>

                <div 
                    className={isClickStatisticOrdersReceived ? clsx(style["statistic-received-active"]) : clsx(style["statistic-received"])}
                    onClick={handleOnClickStatisticOrdersReceived}
                >
                    Statistic Orders Received
                </div>
            </div>
        </div>
    );
}

export default ManageTransactionNav;
