import clsx from "clsx";
import style from "./ManageTransaction.module.scss";

function ManageTransaction({ onClickCreateAccount }) {
    const handleCreateAccountClick = () => {
        if (onClickCreateAccount) {
            onClickCreateAccount();
        }
    };

    return (
        <div className={clsx(style.content)}>
            <div className={clsx(style.manageForTransactionManagerNav)}>
                <div className={clsx(style.createAccount)} onClick={handleCreateAccountClick}>
                    Create Account
                </div>
                <div className={clsx(style.statisticSent)}>Statistic Orders Sent</div>
                <div className={clsx(style.statisticReceived)}>Statistic Orders Received</div>
            </div>
        </div>
    );
}

export default ManageTransaction;
