import clsx from "clsx";
import style from "./StatisticOrdersReceived.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

function StatisticOrdersReceived(props) {
    const [data, setData] = useState([]);

    const handleGetData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/transaction-manager/get-order-received"
            );
            setData(response.data[0]);
        } catch (err) {
            console.error(err);
        }
    };

    // console.log(data);

    useEffect(() => {
        handleGetData();
    }, []);

    // console.log(data);

    return (
        <div className={clsx(style.container, props.className)}>
            {data.map((data, index) => (
                <div className={clsx(style["sub-container"])} key={index}>
                    <div className={style["customer-container"]}>
                        <div className={style.sender}>
                            <div>
                                <label>Sender Name: </label>
                                <span>{data.customer_name}</span>
                            </div>

                            <div>
                                <label>Sender Phone: </label>
                                <span>{data.customer_phone}</span>
                            </div>
                        </div>

                        <div className={clsx(style.receiver)}>
                            <div>
                                <label>Receiver Name: </label>
                                <span>{data.receiver_name}</span>
                            </div>

                            <div>
                                <label>Receiver Name: </label>
                                <span>{data.receiver_phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className={clsx(style["order-container"])}>
                        <div>
                            <label htmlFor="Weight">Weight: </label>
                            <span>{data.weight} kg</span>
                        </div>

                        <div>
                            <label htmlFor="Price">Price: </label>
                            <span>{data.price} $</span>
                        </div>

                        <div>
                            <label htmlFor="Date">Date: </label>
                            <span>{data.date}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatisticOrdersReceived;
