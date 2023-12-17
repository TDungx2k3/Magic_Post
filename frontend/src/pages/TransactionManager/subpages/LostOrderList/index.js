import clsx from "clsx";
import style from "./LostOrderList.module.scss";
import { Fragment, useContext, useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { LoginContext } from "../../../../App";
import axios from "axios";

function LostOrderList() {
    const userInfo = useContext(LoginContext)

    const [lostOrderList, setLostOrderList] = useState([]);
    const [isFetchedData, setIsFetchedData] = useState(false);

    const getLostOrderList = async () => {
        try {
            const lostOrderList = await axios.get("http://localhost:8080/transaction-manager/get-lost-order-list",
                { params : { unit: userInfo.userInfo.uUnit } }
            )
            setLostOrderList(lostOrderList.data[0]);
            setIsFetchedData(true);
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getLostOrderList();
    }, [isFetchedData]);

    return (
        <Fragment>
            <Header />

            <div className={clsx(style.container)}>
                {lostOrderList && lostOrderList.length > 0 ? (
                    lostOrderList.map((lostOrderList, index) => (
                        <div className={clsx(style["sub-container"])} key={index}>
                            <div className={style["customer-container"]}>
                                <div className={style.sender}>
                                    <div>
                                        <label>Sender Name: </label>
                                        <span>{lostOrderList.customer_name || "N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Sender Phone: </label>
                                        <span>{lostOrderList.customer_phone || "N/A"}</span>
                                    </div>
                                </div>

                                <div className={clsx(style.receiver)}>
                                    <div>
                                        <label>Receiver Name: </label>
                                        <span>{lostOrderList.receiver_name || "N/A"}</span>
                                    </div>

                                    <div>
                                        <label>Receiver Phone: </label>
                                        <span>{lostOrderList.receiver_phone || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx(style["order-container"])}>
                                <div>
                                    <label htmlFor="Weight">Weight: </label>
                                    <span>{lostOrderList.weight || "N/A"} kg</span>
                                </div>

                                <div>
                                    <label htmlFor="Price">Price: </label>
                                    <span>{lostOrderList.price || "N/A"} $</span>
                                </div>

                                <div>
                                    <label htmlFor="Date">Date: </label>
                                    <span>{lostOrderList.date || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    )
                    )) :
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
                }
            </div>

            <Footer />
        </Fragment>
    )
}

export default LostOrderList;
