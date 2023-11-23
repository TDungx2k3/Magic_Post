import clsx from "clsx";
import style from "./StatisticOrdersSent.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

function StatisticOrdersSent(props) {
    return (
        <div className={clsx(style.container, props.className)}>
            <div className={clsx(style["sub-container"])}>
                <div>
                    <div>
                        <label htmlFor="Order ID">Order ID: </label>
                        <span></span>
                    </div>

                    <div>
                        <label htmlFor="Weight">Weight: </label>
                        <span> kg</span>
                    </div>

                    <div>
                        <label htmlFor="Price">Price: </label>
                        <span> $</span>
                    </div>

                    <div>
                        <label htmlFor="Date">Date: </label>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatisticOrdersSent;
