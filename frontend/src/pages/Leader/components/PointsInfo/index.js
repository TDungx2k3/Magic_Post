import clsx from "clsx";
import { Fragment } from "react";
import style from "./PointsInfo.module.scss";

function PointsInfo(props) {
    return (
        <Fragment>
            <div className = {clsx(style.infoContainer)}>
                <div className = {clsx(style.pointInfoContainer)}>
                    <label>Name: </label>
                    <span className = {clsx(style.pointName)}>{props.data.gather_name}</span>
                </div>

                <div className = {clsx(style.managerInfoContainer)}>
                    <div className = {clsx(style.nameContainer)}>
                        <label>Manager Name: </label>
                        <span className = {clsx(style.managerName)}>{props.data.account_name}</span>
                    </div>

                    <div className = {clsx(style.phoneContainer)}>
                        <label>Manager Phone: </label>
                        <span className = {clsx(style.managerPhone)}>{props.data.account_phone}</span>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default PointsInfo;