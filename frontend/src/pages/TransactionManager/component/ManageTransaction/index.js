import clsx from "clsx";
import style from "./ManageTransaction.module.scss";

function ManageTransaction({ onClickCreateAccount, onClickStatisticOrdersSent, onClickStatisticOrdersReceived}) {
    const handleCreateAccountClick = () => {
        if (onClickCreateAccount) {
            onClickCreateAccount();
        }
    };

    const handleStatisticOrdersSentClick = () => {
        if (onClickStatisticOrdersSent) {
            onClickStatisticOrdersSent();
        }
    }

    const handleStatisticOrdersReceivedClick = () => {
        if (onClickStatisticOrdersReceived) {
            onClickStatisticOrdersReceived();
        }
    }

    return (
        <div className={clsx(style.content)}>
            <div className={clsx(style.manageForTransactionManagerNav)}>
                <div 
                    className={clsx(style.createAccount)} 
                    onClick={handleCreateAccountClick}
                >
                    Create Account
                </div>

                <div 
                    className={clsx(style.statisticSent)} 
                    onClick={handleStatisticOrdersSentClick}
                >
                    Statistic Orders Sent
                </div>

                <div 
                    className={clsx(style.statisticReceived)}
                    onClick={handleStatisticOrdersReceivedClick}
                >
                    Statistic Orders Received
                </div>
            </div>
        </div>
    );
}

export default ManageTransaction;
