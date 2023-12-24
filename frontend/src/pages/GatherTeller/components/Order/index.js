import clsx from "clsx"
import style from "./Order.module.scss"
import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { OrderListStatusContext } from "../OrderList";

function Order(props) {
    const { updateFr, updateFrLost } = useContext(OrderListStatusContext);
    
    const navigate = useNavigate();

    const moveAction = async() => {
        if(props.data.status === 2) {
            try {
                await axios
                .post("http://localhost:8080/gatherTeller/createDeliveryStep3",
                {
                    unit: props.data.order_unit,
                    order_id: props.data.order_id
                })
                .then(() => {
                    updateFr(props.addition);
                })
            } catch (error) {
                console.log(error);
            }
        } else if(props.data.status === 4) {
            try {
                await axios
                .post("http://localhost:8080/gatherTeller/createDeliveryStep5",
                {
                    unit: props.data.order_unit,
                    order_id: props.data.order_id
                })
                .then(() => {
                    updateFr(props.addition);
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const cfSuccess = async() => {
        if(props.data.status === 1) {
            try {
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
                await axios
                .post("http://localhost:8080/gatherTeller/confirmSuccessStep1",
                {
                    to_unit: storedUserInfo.uUnit,
                    order_id: props.data.order_id,
                })
                .then(() => {
                    updateFr(props.addition);
                    
                })
            } catch (error) {
                console.log(error);
            }
        }
        else if(props.data.status === 3) {
            try {
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
                await axios
                .post("http://localhost:8080/gatherTeller/confirmSuccessStep3",
                {
                    to_unit: storedUserInfo.uUnit,
                    order_id: props.data.order_id,
                })
                .then(() => {
                    updateFr(props.addition);
                    
                })
            } catch (error) {
                console.log(error);
            }
        }
        
    };

    const lostOrder = async() => {
        
        await axios
        .post("http://localhost:8080/gatherTeller/lostOrder",
            {
                deliver_id: props.data.max_delivery,
                order_id: props.data.order_id,
            }
        )
        .then(() => {
            updateFrLost(props.addition);
        })
        
    };

    const cusDeny = async() => {
        await axios
        .post("http://localhost:8080/gatherTeller/customerDeny",
            {
                deliver_id: props.data.max_delivery,
                order_id: props.data.order_id,
            }
        )
        .then(() => {
            updateFrLost(props.addition);
        })
    }

    return (
        <Fragment>
            <div className={clsx(style.orderContainer)}
            data-aos="zoom-in-up" data-aos-duration="1000"
            >
                <div className={clsx(style.customersInfo)}>
                    <div className={clsx(style.senderInfo)}>
                        <div className={clsx(style.senderName)}>
                            <label>Sender Name: </label>
                            <span>{props.data.sender_name}</span>
                        </div>

                        <div className={clsx(style.senderPhone)}>
                            <label>Sender Phone: </label>
                            <span>{props.data.sender_phone}</span>
                        </div>
                    </div>

                    <div className={clsx(style.receiverInfo)}>
                        <div className={clsx(style.receiverName)}>
                            <label>Receiver Name: </label>
                            <span>{props.data.receiver_name}</span>
                        </div>

                        <div className={clsx(style.receiverPhone)}>
                            <label>Receiver Phone: </label>
                            <span>{props.data.receiver_phone}</span>
                        </div>

                        
                    </div>
                </div>

                <div className={clsx(style.orderInfoContainer)}>
                    <div className={clsx(style.orderInfo)}>

                    <div className={clsx(style.orderId)}>
                            <label>Order ID: </label>
                            <span>{props.data.order_id}</span>
                        </div>
                        
                        <div className={clsx(style.orderWeight)}>
                            <label>Order Weight: </label>
                            <span>{props.data.order_weight}</span>
                        </div>
                        
                        <div className={clsx(style.orderPrice)}>
                            <label>Order Price: </label>
                            <span>{props.data.order_price}</span>
                        </div>

                        <div className={clsx(style.orderDescription)}>
                            <label>Delivery Date: </label>
                            <span>{props.data.order_date}</span>
                        </div>

                        <div className={clsx(style.receiverAddress)}>
                            <label>Receiver Address: </label>
                            <span>{props.data.receiver_address}</span>
                        </div>
                    </div>

                    <div className={clsx(style.orderStatus)}>
                        <div className={clsx(style.cfStatus, {[style.hidden] : props.data.status !== 1 && (props.data.status !== 3 || !props.isTo)})}>
                            <div className={clsx(style.successStatus)}
                            onClick={cfSuccess}
                            >Success</div>
                            <div className={clsx(style.pendingStatus)}
                            onClick={lostOrder}>Lost order</div>
                        </div>

                        <div className={clsx(style.inStatus, {[style.hidden] : props.data.status !== 2 && props.data.status !== 4})}>
                            <div className={clsx(style.moveAct)}
                            onClick={moveAction}
                            >Move</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Order;