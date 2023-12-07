import clsx from "clsx"
import style from "./Order.module.scss"
import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { OrderListStatusContext } from "../OrderList";

function Order(props) {
    const { updateFr } = useContext(OrderListStatusContext);
    
    const navigate = useNavigate();

    const moveAction = async() => {
        if(props.data.status === 0) {
            try {
                await axios
                .post("http://localhost:8080/transTeller/createDeliveryStep1",
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
        } else if(props.data.status === 6) {
            try {
                await axios
                .post("http://localhost:8080/transTeller/transToCustomerStep7",
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
        try {
            await axios
            .post("http://localhost:8080/transTeller/confirmSuccessStep5",
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
    };

    const customerAccept = async() => {
        try {
            await axios
            .post("http://localhost:8080/transTeller/customerAccept",
            {
                order_id: props.data.order_id
            })
            .then(() => {
                setTimeout(() => {
                    updateFr(props.addition);
                }, 10);
            })
        } catch (error) {
            console.log(error);
        }
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
                        <div className={clsx(style.cfStatus, {[style.hidden] : props.data.status !== 5})}>
                            <div className={clsx(style.successStatus)}
                            onClick={cfSuccess}
                            >Success</div>
                            <div className={clsx(style.pendingStatus)}>Lost order</div>
                        </div>

                        <div className={clsx(style.inStatus, {[style.hidden] : props.data.status !== 0 && props.data.status !== 6})}>
                            <div className={clsx(style.moveAct)}
                            onClick={moveAction}
                            >Move</div>
                        </div>

                        <div className={clsx(style.shippingStatus, {[style.hidden] : props.data.status !== 7})}>
                            <div className={clsx(style.cusAcepted, )}
                            onClick={customerAccept}
                            >Success</div>
                            <div className={clsx(style.cusDenied, )}>Denied</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Order;