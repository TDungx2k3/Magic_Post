import clsx from "clsx";
import style from "./ManageGatherNav.module.scss";
import { useState } from "react";

function ManageGatherNav({ onClickManageAccountEmployee, onClickStatisticOrdersSent, onClickStatisticOrdersReceived }) {
    // Hàm này để handle xem có click vào ManageAccountEmployee không, nếu bấm vào thì sẽ render ra component ManageAccountEmployee
    const handleManageAccountEmployeeClick = () => {
        if (onClickManageAccountEmployee) {
            onClickManageAccountEmployee();
        }
    };

    // Hàm này để handle xem có click vào StatisticOrdersSent không, nếu bấm vào thì sẽ render ra component StatisticOrdersSent
    const handleStatisticOrdersSentClick = () => {
        if (onClickStatisticOrdersSent) {
            onClickStatisticOrdersSent();
        }
    }

    // Hàm này để handle xem có click vào StatisticOrdersReceived không, nếu bấm vào thì sẽ render ra component StatisticOrdersReceived
    const handleStatisticOrdersReceivedClick = () => {
        if (onClickStatisticOrdersReceived) {
            onClickStatisticOrdersReceived();
        }
    }

    const [isClickManageAccountEmployee, setIsClickManageAccountEmpoyee] = useState(true); // Để kiểm tra xem có click vào ManageAccountEmployee
    const [isClickStatisticOrdersSent, setIsClickStatisticOrdersSent] = useState(false); // Để kiểm tra xem có click vào StatisticOrdersSent
    const [isClickStatisticOrdersReceived, setIsClickStatisticOrdersReceived] = useState(false); // Để kiểm tra xem có click vào StatisticOrdersReceived

    // Khi bấm vào ManageAccountEmployee thì set ClickManageAccountEmployee thành true và 2 cái còn lại thành false
    const handleIsClickManageAccountEmployee = () => {
        setIsClickManageAccountEmpoyee(true);
        setIsClickStatisticOrdersSent(false);
        setIsClickStatisticOrdersReceived(false);
    }

    // Khi bấm vào StatisticOrdersSent thì set StatisticOrdersSent thành true và 2 cái còn lại thành false
    const handleIsClickStatisticOrdersSent = () => {
        setIsClickStatisticOrdersSent(true);
        setIsClickManageAccountEmpoyee(false);
        setIsClickStatisticOrdersReceived(false);
    }

    // Khi bấm vào StatisticOrdersReceived thì set StatisticOrdersReceived thành true và 2 cái còn lại thành false
    const handleIsClickStatisticOrdersReceived = () => {
        setIsClickStatisticOrdersReceived(true);
        setIsClickStatisticOrdersSent(false);
        setIsClickManageAccountEmpoyee(false);
    }

    const handleOnClickManageAccountEmployee = () => {
        handleManageAccountEmployeeClick();
        handleIsClickManageAccountEmployee();
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
            <div className={clsx(style.manageForGatherManagerNav)}>
                <div 
                    className={isClickManageAccountEmployee ? clsx(style["manage-account-employee-active"]) : clsx(style["manage-account-employee"])} 
                    onClick={handleOnClickManageAccountEmployee}
                >
                    Manage Account Employee
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

export default ManageGatherNav;
