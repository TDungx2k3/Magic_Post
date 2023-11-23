import { Fragment, useState, useEffect, useContext } from "react";
import Header from '../../../../components/Header'
import Footer from "../../../../components/Footer";
import PointsInfo from "../../components/PointsInfo";
import clsx from "clsx";
import style from './ManageGather.module.scss';
import TransactionList from '../../components/TransactionList';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EmployeeList from "../../components/EmployeeList";
import { LoginContext } from "../../../../App";

function ManageGather() {

    const location = useLocation();
    const gatherId = new URLSearchParams(location.search).get("gather_id");
    // console.log(gatherId);
    const { isLogin, setIsLogin, userInfo, setUserInfo} = useContext(LoginContext);
    const navigate = useNavigate();
    const [transactionsData, setTransactionsData] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [rerender, setRerender] = useState(true);
    const [gatherInfo, setGatherInfo] = useState(
        {
            gather_name: "",
            account: {
                account_name: "",
                account_phone: ""
            }
        }
    );

    const getGatherInfo = async(e) => {
        try {
            await axios
            .get("http://localhost:8080/leader/getGatherInfo",
            {
                params:{
                    gather_id : gatherId
                }
            }
            )
            .then((res) => {
                // console.log(res.data);
                setGatherInfo(res.data[0])
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getAllTransactionsWithGatherId = async(e) => {
        try {
            await axios
            .get("http://localhost:8080/leader/getAllTransactionsWithGatherId",
            {
                params:{
                    gather_id : gatherId
                }
            }
            )
            .then((res) => {
                // console.log(res.data);
                setTransactionsData(res.data)
            })
        } catch (error) {
            console.log(error);
        }
    };

    const getAllEmployees = async(e) => {
        try {
            await axios
            .get("http://localhost:8080/leader/getAllEmployeesInUnit",
            {
                params: {
                    unit: gatherId,
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
        getGatherInfo();
        getAllTransactionsWithGatherId();
        getAllEmployees();
        if(!isLogin && cnt === 0) {
            cnt ++;
            alert("You have to login before access this page!");
            navigate("/login");
        }
    }, [rerender]);

    const [manageState, setManageState] = useState(1);
    return (
        <Fragment>
            <Header/>
            <PointsInfo data = {gatherInfo}/>
            <div className={clsx(style.content)}>
                <div className= {clsx(style.manageGatherNav)}>
                    <div className={clsx(style.transManage, {[style.active] : manageState === 1} )}
                    onClick={() => {
                        setManageState(1);
                    }}
                    >Transactions</div>
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
                <div className={clsx(style.subPage, {[style.hidden] : manageState !== 1})}>
                    <TransactionList data = {transactionsData}/>
                </div>
                
                <div className={clsx(style.subPage, {[style.hidden] : manageState !== 3})}>
                    <EmployeeList data = {employeeList}/>
                </div>
                
                
            </div>
            
            <Footer/>
        </Fragment>
    );
}

export default ManageGather;