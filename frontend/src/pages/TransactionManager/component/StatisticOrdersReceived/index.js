import clsx from "clsx";
import style from "./StatisticOrdersReceived.module.scss";

function StatisticOrdersReceived(props) {
    return (
        <div className={clsx(style.container, props.className)}>
            <div className={clsx(style["sub-container"])}>
                <div>
                    <label htmlFor="">Order ID tets: </label>
                    <span></span>
                </div>

                <div>
                    <label htmlFor="">Weight: </label>
                    <span></span>
                </div>

                <div>
                    <label htmlFor="">Price: </label>
                    <span></span>
                </div>
            </div>
        </div>
    )
}

export default StatisticOrdersReceived;
