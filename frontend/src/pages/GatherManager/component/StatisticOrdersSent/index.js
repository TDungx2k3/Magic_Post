import clsx from "clsx";
import style from "./StatisticOrdersSent.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../../../App";

function StatisticOrdersSent(props) {
    const userInfo = useContext(LoginContext);

    const [ordersSent, setOrdersSent] = useState([]);
    const [isGotOrdersSent, setIsGotOrdersSent] = useState(false);
    
    const getOrdersSent = async () => {
        try {
            const ordersSent = await axios.get("http://localhost:8080/gathering-manager/all-orders-sent",
                {
                    params: { unit: userInfo.userInfo.uUnit }
                }
            );
            setOrdersSent(ordersSent);
            setIsGotOrdersSent(true);
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getOrdersSent();
    }, [isGotOrdersSent]);

    return (
        <Fragment>
            <div className={clsx(style.container, props.className)}>
                {ordersSent && ordersSent.length > 0 ? (
                    ordersSent.map((ordersSent, index) => (
                        <div className={clsx(style["sub-container"])} key={index}>
                            <div className={style["customer-container"]}>
                                <div className={style.sender}>
                                    <div>
                                        <label>Sender Name: </label>
                                        <span>{ordersSent.customer_name || "N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Sender Phone: </label>
                                        <span>{ordersSent.customer_phone || "N/A"}</span>
                                    </div>
                                </div>

                                <div className={clsx(style.receiver)}>
                                    <div>
                                        <label>Receiver Name: </label>
                                        <span>{ordersSent.receiver_name || "N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Receiver Phone: </label>
                                        <span>{ordersSent.receiver_phone || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx(style["order-container"])}>
                                <div>
                                    <label htmlFor="Weight">Weight: </label>
                                    <span>{ordersSent.weight || "N/A"} kg</span>
                                </div>

                                <div>
                                    <label htmlFor="Price">Price: </label>
                                    <span>{ordersSent.price || "N/A"} $</span>
                                </div>

                                <div>
                                    <label htmlFor="Date">Date: </label>
                                    <span>{ordersSent.date || "N/A"}</span>
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

export default StatisticOrdersSent;
