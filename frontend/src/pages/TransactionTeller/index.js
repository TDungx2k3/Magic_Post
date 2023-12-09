import clsx from "clsx"
import { Fragment, useContext, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import style from "./TransactionTeller.module.scss";
import { useNavigate } from "react-router-dom";

function TransactionTeller() {

    const navigate = useNavigate();
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    let cnt = 0;
    useEffect(() => {
        if((!storedIsLogin 
            || nowTime - storedOutTime > 3600000 
            || storedUserInfo.uRole != "3") // Sau do chuyen thanh 3
            && cnt === 0
            ) {
            cnt ++;
            alert("You have to login with Transaction Teller account before access this page!");
            navigate("/login");
            localStorage.setItem('isLogin', JSON.stringify(false));
            localStorage.setItem('userInfo', JSON.stringify({
                uId : "",
                uName : "",
                uPhone : "",
                uPassword : "",
                uRole: "",
                uUnit: ""
            }));
        }
    }, [1])
    return (
        <Fragment>
            <Header />
            <div className={clsx(style.content)}>
                <div>
                    <h1 onClick={() => {
                        navigate("/createOrder");
                    }}>Create Order</h1>
                </div>

                <div>
                    <h1>Manage Orders</h1>

                    <div onClick={() => {
                        navigate("/transTellerFromCus");
                    }}>
                        <h2>Orders From Customers</h2>
                    </div>

                    <div onClick={() => {
                        navigate("/transTellerToCus");
                    }}>
                        <h2>Orders To Customers</h2>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default TransactionTeller;