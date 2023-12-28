import clsx from "clsx"
import style from "./Transaction.module.scss"
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Transaction(props) {

    const navigate = useNavigate();

    // Xóa tất cả tài khoản nhân viên thuộc về transaction này
    const deleteAllAccountInTransaction = async() => {
        try {
            await axios.post("http://localhost:8080/account/deleteAllAccountInTransaction",
            {
                unit: props.data.transactionId,
            }
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Xóa điểm giao dịch
    const deleteTransaction = async() => {
        try {
            await axios.post("http://localhost:8080/account/deleteTransaction",
            {
                trans_id: props.data.transactionId,
            }
            );
        } catch (error) {
            console.log(error);
        }
    }

    
    const [confirmHidden, setConfirmHidden] = useState(true);
    const [isHide, setIsHide] = useState(true);
    return (
        <Fragment>
            <div className= {clsx(style.transactionContainer)}
            data-aos="zoom-in-up" data-aos-duration="1000">
                <Link to = {`/leaderManageTransaction?trans_id=${props.data.transactionId}`} className= {clsx(style.transactionInfo)}>
                    <div>
                        <label htmlFor="transactionName">Transaction Name: </label>
                        <span id="transactionName">{props.data.transactionName}</span>
                    </div>
                    
                    <div className= {clsx(style.transactionManager)}>
                        <div>
                            <label>Transaction Manager Name: </label>
                            <span className= {clsx(style.transactionManagerName)}>{props.data.transactionManagerName}</span>
                        </div>
                        <div>
                            <label>Transaction Manager Phone: </label>
                            <span className= {clsx(style.transactionManagerPhone)}>{props.data.transactionManagerPhone}</span>
                        </div>
                        
                    </div>
                </Link>

                <div className= {clsx(style.transactionBtns)}>
                    <div className= {clsx(style.deleteBtn)} onClick={
                        () => {
                            setConfirmHidden(false);
                            setIsHide(false);
                        }
                    }>
                        <i className= "ti-trash" ></i>
                    </div>

                    <Link to = {`/modifyTransaction?trans_id=${props.data.transactionId}`} className= {clsx(style.modifyBtn)}>
                        <i className= "ti-reload"></i>
                    </Link>
                </div>
            </div>

            <div className={clsx(style.confirmDeleteTransactionContainer, {[style.hidden] : confirmHidden})} 
            onClick={() => {
                setConfirmHidden(true);
            }}
            data-aos="zoom-out-up" data-aos-duration="1000">
                <div className={clsx(style.contentCF)}
                onClick={(e) => {
                    setConfirmHidden(false);
                    e.stopPropagation();
                }}>
                    <h2>Are you sure to delete this transactioning?</h2>
                    <p>This action is irreversible.</p>
                    <div className={(style.confirmBtns)}>
                        <div className={clsx(style.yesBtn)}
                        onClick={async(e) => {
                            
                            if(window.confirm("Do you want to delete this transaction?")) {
                                await deleteTransaction();
                                await deleteAllAccountInTransaction();
                                setConfirmHidden(true);
                                navigate("/leader");
                                setTimeout(() => {
                                    navigate("/leaderManageGather?gather_id=" + props.data.gatherId)
                                }, 0);
                            }
                        }}
                        >Yes</div>
                        <div className={clsx(style.noBtn)}
                        onClick={(e) => {
                            setConfirmHidden(true);
                            e.stopPropagation();
                        }}
                        >No</div>
                    </div>
                </div>
                
            </div>
        </Fragment>
    );
}

export default Transaction;