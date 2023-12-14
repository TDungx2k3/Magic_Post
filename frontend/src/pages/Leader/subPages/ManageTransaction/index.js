import { Fragment, useState, useEffect, useContext } from "react";
import Header from '../../../../components/Header'
import Footer from "../../../../components/Footer";
import PointsInfo from "../../components/PointsInfo";
import clsx from "clsx";
import style from './ManageTransaction.module.scss';
import TransactionList from '../../components/TransactionList';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EmployeeList from "../../components/EmployeeList";
import OrderList from "../../components/OrderList";

function ManageTransaction() {

    const location = useLocation();
    const transId = new URLSearchParams(location.search).get("trans_id");
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    const navigate = useNavigate();
    const [transactionsData, setTransactionsData] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [rerender, setRerender] = useState(true);
    const [transInfo, setTransInfo] = useState(
        {
            trans_name: "",
            account_name: "",
            account_phone: ""
        }
    );

    const getTransInfo = async(e) => {
        try {
            await axios
            .get("http://localhost:8080/leader/getTransactionInfo",
            {
                params:{
                    trans_id : transId
                }
            }
            )
            .then((res) => {
                console.log(res.data);
                setTransInfo(res.data[0])
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getAllEmployees = async(e) => {
        try {
            await axios
            .get("http://localhost:8080/leader/getAllEmployeesInUnit",
            {
                params: {
                    unit: transId,
                }
            }
            )
            .then((res) => {
                setEmployeeList(res.data);
                // console.log(res.data);
            })
        } catch (error) {
            console.log(error);
        }
    }
    let cnt = 0;
    useEffect(() => {
        getTransInfo();
        getAllEmployees();
        if((!storedIsLogin 
            || nowTime - storedOutTime > 3600000 
            || storedUserInfo.uRole != "1")
            && cnt === 0
            ) {
            cnt ++;
            alert("You have to login with leader account before access this page!");
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
    }, [rerender]);

    const [manageState, setManageState] = useState(2);
    return (
        <Fragment>
            <Header/>
            <PointsInfo data = {transInfo}/>
            <div className={clsx(style.content)}>
                <div className= {clsx(style.manageTransactionNav)}>
                    <div className={clsx(style.ordersManage, {[style.active] : manageState === 2})}
                    onClick={() => {
                        setManageState(2);
                    }}
                    >Orders</div>
                    <div className={clsx(style.employeesManage, {[style.active] : manageState === 3})}
                    onClick={() => {
                        setManageState(3);
                    }}
                    >Employees</div>
                </div>
                <div className={clsx(style.subPage, {[style.hidden] : manageState !== 2})}>
                    <OrderList data = {transId} />
                </div>
                
                <div className={clsx(style.subPage, {[style.hidden] : manageState !== 3})}>
                    <EmployeeList data = {employeeList}/>
                </div>
                
                
            </div>
            
            <Footer/>
        </Fragment>
    );
}

export default ManageTransaction;