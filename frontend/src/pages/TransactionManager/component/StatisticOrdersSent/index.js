import clsx from "clsx";
import style from "./StatisticOrdersSent.module.scss";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../../../../App";

function StatisticOrdersSent(props) {
    const [data, setData] = useState([]);
    const { userInfo } = useContext(LoginContext);
    const [isFetchedData, setIsFetchedData] = useState(false);

    const handleGetData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/transaction-manager/get-order-sent",
                {
                    params: { unit: userInfo.uUnit }
                }
            );
            setData(response.data[0]);
            setIsFetchedData(true);
        } catch (err) {
            console.error(err);
        }
    };
    

    useEffect(() => {
        handleGetData();
    }, [isFetchedData]);

    // console.log(data);

    return (
        <Fragment>
            <div className={clsx(style.container, props.className)}>
                {data && data.length > 0 && data.map((data, index) => (
                    <div className={clsx(style["sub-container"])} key={index}>
                        <div className={style["customer-container"]}>
                            <div className={style.sender}>
                                <div>
                                    <label>Sender Name: </label>
                                    <span>{data.customer_name || "N/A"}</span>
                                </div>

                                <div>
                                    <label>Sender Phone: </label>
                                    <span>{data.customer_phone || "N/A"}</span>
                                </div>
                            </div>

                            <div className={clsx(style.receiver)}>
                                <div>
                                    <label>Receiver Name: </label>
                                    <span>{data.receiver_name || "N/A"}</span>
                                </div>

                                <div>
                                    <label>Receiver Phone: </label>
                                    <span>{data.receiver_phone || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className={clsx(style["order-container"])}>
                            <div>
                                <label htmlFor="Weight">Weight: </label>
                                <span>{data.weight || "N/A"} kg</span>
                            </div>

                            <div>
                                <label htmlFor="Price">Price: </label>
                                <span>{data.price || "N/A"} $</span>
                            </div>

                            <div>
                                <label htmlFor="Date">Date: </label>
                                <span>{data.date || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Fragment>
    );
}

export default StatisticOrdersSent;
