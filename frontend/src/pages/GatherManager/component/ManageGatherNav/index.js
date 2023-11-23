import clsx from "clsx";
import style from "./ManageGatherNav.module.scss";
import { useState } from "react";

function ManageGatherNav({ onClickManageAccountEmployee, onClickStatisticOrdersSent, onClickStatisticOrdersReceived }) {
    const handleManageAccountEmployeeClick = () => {
        if (onClickManageAccountEmployee) {
            onClickManageAccountEmployee();
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

    const [isClickManageAccountEmployee, setIsClickManageAccountEmpoyee] = useState(true);
    const [isClickStatisticOrdersSent, setIsClickStatisticOrdersSent] = useState(false);
    const [isClickStatisticOrdersReceived, setIsClickStatisticOrdersReceived] = useState(false);

    const handleIsClickManageAccountEmployee = () => {
        setIsClickManageAccountEmpoyee(true);
        setIsClickStatisticOrdersSent(false);
        setIsClickStatisticOrdersReceived(false);
    }

    const handleIsClickStatisticOrdersSent = () => {
        setIsClickStatisticOrdersSent(true);
        setIsClickManageAccountEmpoyee(false);
        setIsClickStatisticOrdersReceived(false);
    }

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
