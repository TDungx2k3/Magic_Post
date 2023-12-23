import clsx from "clsx";
import style from "./StatisticOrdersReceived.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../../../App";

function StatisticOrdersReceived(props) {
    const userInfo = useContext(LoginContext);

    const [ordersReceived, setOrdersReceived] = useState([]);
    const [isGotOrdersReceived, setIsGotOrdersReceived] = useState(false);

    const getOrdersReceived = async () => {
        try {
            const ordersReceived = await axios.get("http://localhost:8080/gathering-manager/all-orders-received",
                {
                    params: { unit: userInfo.userInfo.uUnit }
                }
            );
            setOrdersReceived(ordersReceived);
            setIsGotOrdersReceived(true);
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getOrdersReceived();
    }, [isGotOrdersReceived]);

    return (
        <Fragment>
            <div className={clsx(style.container, props.className)}>
                {ordersReceived && ordersReceived.length > 0 ? (
                    ordersReceived.map((ordersReceived, index) => (
                        <div className={clsx(style["sub-container"])} key={index}>
                            <div className={style["customer-container"]}>
                                <div className={style.sender}>
                                    <div>
                                        <label>Sender Name: </label>
                                        <span>{ordersReceived.customer_name || "N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Sender Phone: </label>
                                        <span>{ordersReceived.customer_phone || "N/A"}</span>
                                    </div>
                                </div>

                                <div className={clsx(style.receiver)}>
                                    <div>
                                        <label>Receiver Name: </label>
                                        <span>{ordersReceived.receiver_name || "N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Receiver Phone: </label>
                                        <span>{ordersReceived.receiver_phone || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx(style["order-container"])}>
                                <div>
                                    <label htmlFor="Weight">Weight: </label>
                                    <span>{ordersReceived.weight || "N/A"} kg</span>
                                </div>

                                <div>
                                    <label htmlFor="Price">Price: </label>
                                    <span>{ordersReceived.price || "N/A"} $</span>
                                </div>

                                <div>
                                    <label htmlFor="Date">Date: </label>
                                    <span>{ordersReceived.date || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={clsx(style["sub-container"])}>
                        <div className={style["customer-container"]}>
                            <div className={style.sender}>
                                <div>
                                    <label>Sender Name: </label>
                                    <span>{"N/A"}</span>
                                </div>

                                <div>
                                    <label>Sender Phone: </label>
                                    <span>{"N/A"}</span>
                                </div>
                            </div>

                            <div className={clsx(style.receiver)}>
                                <div>
                                    <label>Receiver Name: </label>
                                    <span>{"N/A"}</span>
                                </div>

                                <div>
                                    <label>Receiver Phone: </label>
                                    <span>{"N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className={clsx(style["order-container"])}>
                            <div>
                                <label htmlFor="Weight">Weight: </label>
                                <span>{"N/A"} kg</span>
                            </div>

                            <div>
                                <label htmlFor="Price">Price: </label>
                                <span>{"N/A"} $</span>
                            </div>

                            <div>
                                <label htmlFor="Date">Date: </label>
                                <span>{"N/A"}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default StatisticOrdersReceived;
