import clsx from "clsx";
import style from "./StatisticOrdersSent.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

function StatisticOrdersSent(props) {
    const [data, setData] = useState([]);

    const handleGetData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/transaction-manager/test-get-order-sent"
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
            <div className={clsx(style["sub-container"])}>
                {data.map((order) => (
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

                        {order.deliveries.map((delivery, index) => (
                            <div key={index}>
                                <label htmlFor="From ID">From ID: </label>
                                <span>{delivery.from_id}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatisticOrdersSent;
