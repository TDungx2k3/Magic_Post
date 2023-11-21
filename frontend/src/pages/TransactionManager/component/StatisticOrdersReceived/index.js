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
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        handleGetData();
    }, []);

    console.log(data);

    return (
        <div className={clsx(style.container, props.className)}>
            {data.map((order) => (
                <div className={clsx(style["sub-container"])}>
                    <div key={order.order_id}>
                        <div>
                            <label htmlFor="Order ID">Order ID: </label>
                            <span>{order.order_id}</span>
                        </div>

                        <div>
                            <label htmlFor="Weight">Weight: </label>
                            <span>{order.weight} kg</span>
                        </div>

                        <div>
                            <label htmlFor="Price">Price: </label>
                            <span>{order.price} $</span>
                        </div>

                        <div>
                            <label htmlFor="Date">Date: </label>
                            <span>{order.date}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatisticOrdersReceived;
