import clsx from "clsx"
import style from "./Order.module.scss"
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Order(props) {

    const navigate = useNavigate();
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
                            <label>Order Date: </label>
                            <span>{props.data.order_date}</span>
                        </div>

                        <div className={clsx(style.receiverAddress)}>
                            <label>Receiver Address: </label>
                            <span>{props.data.receiver_address}</span>
                        </div>
                    </div>

                    <div className={clsx(style.orderStatus)}>
                        <div className={clsx(style.cfStatus, {[style.hidden] : props.data.status !== 5})}>
                            <div className={clsx(style.successStatus)}>Success</div>
                            <div className={clsx(style.pendingStatus)}>Pending</div>
                        </div>

                        <div className={clsx(style.inStatus, {[style.hidden] : props.data.status !== 0 && props.data.status !== 6})}>
                            <div className={clsx(style.moveAct)}>Move</div>
                        </div>

                        <div className={clsx(style.shippingStatus, {[style.hidden] : props.data.status !== 1 && props.data.status !== 7})}>
                            <div className={clsx(style.shLost)}>Lost</div>
                            <div className={clsx(style.cusDenied)}>Denied</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Order;