import { Fragment, useState, useEffect, useContext } from "react";
import clsx from "clsx";
import style from './CreateTransaction.module.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


function CreateTransaction() {
    const navigate = useNavigate();
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    const location = useLocation();
    const gatherId = new URLSearchParams(location.search).get("gather_id");
    
    const [rerender] = useState(true);
    const [options, setOptions] = useState(1);
    const [transactionNameErr, setTransactionNameErr] = useState("");
    const [managerNameErr, setManagerNameErr] = useState("");
    const [managerPhoneErr, setManagerPhoneErr] = useState("");
    const [newPasswordErr, setNewPasswordErr] = useState("");

    const [transactionInfo, setTransactionInfo] = useState(
        {
            transaction_name: "",
            account_name: "",
            account_phone: "",
            account_password: "",
            gather_id: ""
        }
    );

    const transNameNormalize = (name) => {
        
        const tenChuanHoa = name.replace(/\s+/g, " ").trim();
        
        return tenChuanHoa.charAt(0).toUpperCase() + tenChuanHoa.slice(1);
    };


    const checkTransactionName = () => {
        let tName = document.querySelector("." + style.transactionNameContainer + " input").value;
        // console.log(gName);
        if(tName === "") {
            setTransactionNameErr("Please enter valid transaction name!")
        }
        else {
            document.querySelector("." + style.transactionNameContainer + " input").value = transNameNormalize(tName);
        }
    };

    const managerNameNormalize = (name) => {
        // Chia tách tên thành các từ
        name = name.replace(/\s+/g, " ").trim();
        const words = name.split(" ");

        // Chuẩn hóa từng từ
        const capitalizeWords = words.map((word) => {
            // Loại bỏ dấu và viết hoa chữ cái đầu tiên của từ
            const tuChuanHoa = word.replace(/[\u0300-\u036f\s]/g, "");
            return tuChuanHoa.charAt(0).toUpperCase() + tuChuanHoa.slice(1);
        });

        // Kết hợp các từ đã chuẩn hóa để tạo tên mới
        const rs = capitalizeWords.join(" ");

        return rs;
    };

    const checkManagerName = () => {
        let mName = document.querySelector("." + style.nameContainer + " input").value;
        // console.log(gName);
        if(mName === "") {
            setManagerNameErr("Please enter valid manager name!")
        }
        else {
            document.querySelector("." + style.nameContainer + " input").value = managerNameNormalize(mName);
        }
    };

    const checkManagerPhone = () => {
        let mPhone = document.querySelector("." + style.phoneContainer + " input").value;
        // console.log(gName);
        let phoneRegex = /^0\d+$/;
        if(!mPhone.match(phoneRegex)) {
            setManagerPhoneErr("Please enter valid manager phone!")
        }
        else if(mPhone.length !== 10) {
            setManagerPhoneErr("Your phone number must have 10 numbers!")
        }
    };

    const checkNewPassword = () => {
        let newPwd = document.querySelector("." + style.newPasswordContainer + " input").value;
        if(!(newPwd === "")) {
            if (newPwd.length < 6) {
                setNewPasswordErr("Your password must be larger than 6 characters!")
            }
            else if (newPwd.length > 30) {
                setNewPasswordErr("Your password must be smaller than 30 characters!")
            }
        }
    };

    const createTransaction = async(tId, tName, mId, gId) => {
        // console.log("cg");
        try {
            const response = await axios.post("http://localhost:8080/leader/createTransaction",
            {
                transaction_id: tId,
                transaction_name: tName,
                account_id: mId,
                gather_id: gId
            }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const createTransactionManager = async(mName, mPhone) => {
        // console.log("cgm");
        try {
            await axios.post("http://localhost:8080/leader/createTransactionManager",
            {
                manager_name: mName,
                manager_phone: mPhone,
            }
            );
            
        } catch (error) {
            console.log(error);
        }
        // console.log("cgme");
    }

    const updateManagerPassword = async(newMId, newPwd) => {
        // console.log(newMId);
        // console.log(newPwd);
        try {
            await axios.post("http://localhost:8080/leader/updateManagerPassword",
            {
                manager_id: newMId,
                new_password: newPwd
            }
            )
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleChange = (e) => {
        setTransactionInfo((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const checkCntPhone = async(e) => {
        try {
            const res = await axios.get("http://localhost:8080/leader/getCntPhone",
            {
                params :{
                    account_phone: transactionInfo.account_phone,
                }
            }
            );
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getNewestAID = async() => {
        try {
            const res = await axios.get("http://localhost:8080/leader/getNewestAId",);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getNewTransactionId = async() => {
        try {
            const res = await axios.get("http://localhost:8080/leader/getMaxTransactionId",);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async(e) => {
        
        checkTransactionName();
        checkManagerName();
        checkManagerPhone();
        checkNewPassword();

        let cnt = await checkCntPhone();
        if(cnt > 0) {
            alert("This phone number is already used by another account");
        }
        else if(transactionNameErr === ""
        && managerNameErr === ""
        && managerPhoneErr === ""
        && newPasswordErr === "" ) {
            let newTId = await getNewTransactionId();
            if(window.confirm("Click OK to create transaction and manager with infomation below.")) {

                await Promise.all([
                    createTransactionManager(transactionInfo.account_name, transactionInfo.account_phone),
                    createTransaction(newTId, transactionInfo.transaction_name, 5, gatherId),
                    console.log(1),
                ]);
                
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            let newMId = await getNewestAID();
            if(transactionInfo.account_password !== "") {
                // console.log(newPwd);
                await updateManagerPassword(newMId, transactionInfo.account_password);
            }

            console.log(3);
            
            // update account_id in transactions
            await axios.post("http://localhost:8080/leader/updateAccountInTransaction",
            {
                account_id: newMId,
                transaction_id: newTId,  
            }
            );
            // update unit in accounts
            await axios.post("http://localhost:8080/leader/updateUnitInAccount",
            {
                account_id: newMId,
                unit: newTId,  
            }
            );
            console.log(4);
            navigate("/leader");
        }
    };
    
    let cnt = 0;
    useEffect(() => {
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

    return (
        <Fragment>
            <div className={clsx(style.transactionOptionContainer)}>
                <div className={clsx(style.managerOption, {[style.optionActive] : options === 1})}
                onClick={() => {
                    setOptions(1);
                }}
                >Manager Infomation</div>
                <div className={clsx(style.passwordOption, {[style.optionActive] : options === 2})}
                onClick={() => {
                    setOptions(2);
                }}
                >Change Password</div>
            </div>

            <div className = {clsx(style.modifyTransactionContainer)}>
                <div className={clsx(style.transactionInfoContainer)}>
                    <div className = {clsx(style.transactionNameContainer)}>
                        <label>Transaction Name: </label>
                        <br/>
                        <input type="text" placeholder="Enter Transaction Name"
                        onBlur={checkTransactionName}
                        onClick={() => {
                            setTransactionNameErr("");
                        }}
                        name="transaction_name"
                        onChange={handleChange}
                        />
                        <br/>
                        <div className={clsx(style.err)}>{transactionNameErr}</div>
                    </div>

                    
                </div>
                
                <div className = {clsx(style.managerInfoContainer, {
                    [style.hidden]: options !== 1
                })}>
                    <div className = {clsx(style.nameContainer)}>
                        <label>Manager Name: </label>
                        <br/>
                        <input type="text"
                        placeholder="Enter Manager Name"
                        onBlur={checkManagerName}
                        onClick={() => {
                            setManagerNameErr("");
                        }}
                        name="account_name"
                        onChange={handleChange}
                        />
                        <br/>
                        <div className={clsx(style.err)}>{managerNameErr}</div>
                    </div>

                    <div className = {clsx(style.phoneContainer)}>
                        <label>Manager Phone: </label>
                        <input type="text"
                        placeholder="Enter Manager Phone Number"
                        onBlur={checkManagerPhone}
                        onClick={() => {
                            setManagerPhoneErr("");
                        }}
                        name="account_phone"
                        onChange={handleChange}
                        />
                        <br/>
                        <div className={clsx(style.err)}>{managerPhoneErr}</div>
                    </div>
                </div>

                <div className = {clsx(style.changePasswordContainer, {
                    [style.hidden]: options !== 2
                })}>
                    <div className = {clsx(style.newPasswordContainer)}>
                        <label>Manager New Password: </label>
                        <br/>
                        <input type="text" placeholder="Enter new password!"
                        onBlur={checkNewPassword}
                        onClick={() => {
                            setNewPasswordErr("");
                        }}
                        name="account_password"
                        onChange={handleChange}
                        />
                        <br/>
                        <div className={clsx(style.err)}>{newPasswordErr}</div>
                    </div>
                </div>
            </div>

            <div className={clsx(style.confirmBtns)}>
                <div className={clsx(style.saveBtn)}
                onClick={handleSubmit}
                >
                    Save
                </div>

                <Link to = "/leader" className={clsx(style.cancelBtn)}>
                    Cancel
                </Link>
            </div>
        </Fragment>
        
    );
}

export default CreateTransaction;