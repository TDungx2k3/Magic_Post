import clsx from "clsx";
import style from "./StatisticOrdersSent.module.scss"

function StatisticOrdersSent(props) {
    return (
        <div className={clsx(style.container, props.className)}>
            <div className={clsx(style["sub-container"])}>
                <div>
                    <label htmlFor="">Order ID: </label>
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

export default StatisticOrdersSent;
