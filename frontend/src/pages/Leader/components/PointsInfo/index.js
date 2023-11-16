import clsx from "clsx";
import { Fragment } from "react";
import style from "./PointsInfo.module.scss";

function PointsInfo(props) {
    return (
        <Fragment>
            <div className = {clsx(style.infoContainer)}>
                <div className = {clsx(style.pointInfoContainer)}>
                    <label>Name: </label>
                    <span className = {clsx(style.pointName)}>Kho tập trung miền Bắc</span>
                </div>

                <div className = {clsx(style.managerInfoContainer)}>
                    <div className = {clsx(style.nameContainer)}>
                        <label>Manager Name: </label>
                        <span className = {clsx(style.managerName)}>Dang Tien Dung</span>
                    </div>

                    <div className = {clsx(style.phoneContainer)}>
                        <label>Manager Phone: </label>
                        <span className = {clsx(style.managerPhone)}>1111111111</span>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default PointsInfo;