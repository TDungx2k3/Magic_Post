import { Fragment, useState, useEffect, useContext } from "react";
import clsx from "clsx";
import style from './ModifyTransaction.module.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../../../App";

function ModifyTransaction() {

    // Lưu thông tin đăng nhập
    const navigate = useNavigate();
    const location = useLocation();
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    const transId = new URLSearchParams(location.search).get("trans_id");
    
    // Xử lý lỗi
    const [rerender] = useState(true);
    const [options, setOptions] = useState(1);
    const [transNameErr, setTransNameErr] = useState("");
    const [managerNameErr, setManagerNameErr] = useState("");
    const [managerPhoneErr, setManagerPhoneErr] = useState("");
    const [newPasswordErr, setNewPasswordErr] = useState("");

    // Lưu thông tin điểm giao dịch
    const [transInfo, setTransInfo] = useState(
        {
            account_id: "",
            trans_name: "",
            gather_id: "",
            account_name: "",
            account_phone: ""
        }
    );

    // Lấy thông tin điểm giao dịch
    const getTransData = async(e) => {
        try {
            await axios
            .get("http://localhost:8080/leader/getTransactionInfo",
            {
                params:{
                    trans_id : transId,
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
    };

    // Chuẩn hóa tên điểm giao dịch
    const transNameNormalize = (name) => {
        
        const tenChuanHoa = name.replace(/\s+/g, " ").trim();
        
        return tenChuanHoa.charAt(0).toUpperCase() + tenChuanHoa.slice(1);
    };

    // Check tên điểm giao dịch
    const checkTransName = () => {
        let tName = document.querySelector("." + style.transNameContainer + " input").value;
        // console.log(gName);
        if(tName === "") {
            setTransNameErr("Please enter valid transaction name!")
        }
        else {
            document.querySelector("." + style.transNameContainer + " input").value = transNameNormalize(tName);
        }
    };

    // Chuẩn hóa tên người quản lý điểm giao dịch
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

    // Check tên người quản lý
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

    // Check số điện thoại
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

    // Check password
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

    // Cập nhật thông tin điểm giao dịch
    const updateTrans = async(tName) => {
        try {
            await axios.post("http://localhost:8080/leader/updateTransaction",
            {
                trans_id: transId,
                trans_name: tName
            }
            )
        } catch (error) {
            console.log(error);
        }
    };

    // Cập nhật thông tin người quản lý
    const updateManager = async(mName, mPhone) => {
        try {
            await axios.post("http://localhost:8080/leader/updateManager",
            {
                manager_id: transInfo.account_id,
                manager_name: mName,
                manager_phone: mPhone
            }
            )
        } catch (error) {
            console.log(error);
        }
    }

    // Cập nhật password
    const updateManagerPassword = async(newPwd) => {
        try {
            await axios.post("http://localhost:8080/leader/updateManagerPassword",
            {
                manager_id: transInfo.account_id,
                new_password: newPwd
            }
            )
        } catch (error) {
            console.log(error);
        }
    }

    // Đếm số lượng tài khoản theo số điện thoại
    const checkCntPhone = async(e) => {
        try {
            const res = await axios.get("http://localhost:8080/leader/getCntPhone",
            {
                params :{
                    account_phone: transInfo.account_phone,
                }
            }
            );
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    // Xử lý sửa thông tin điểm giao dịch
    const handleSubmit = async(e) => {
        let tName = document.querySelector("." + style.transNameContainer + " input").value;
        let mName = document.querySelector("." + style.nameContainer + " input").value;
        let mPhone = document.querySelector("." + style.phoneContainer + " input").value;
        let newPwd = document.querySelector("." + style.newPasswordContainer + " input").value;

        checkTransName();
        checkManagerName();
        checkManagerPhone();
        checkNewPassword();

        let cnt = await checkCntPhone();
        if(cnt > 0 && transInfo.account_phone !== mPhone) {
            alert("This phone number is already used by another account");
        }
        else if(transNameErr === ""
        && managerNameErr === ""
        && managerPhoneErr === ""
        && newPasswordErr === "" ) {
            alert("Click OK to update transaction and manager with infomation below.");
            await updateTrans(tName);
            await updateManager(mName, mPhone);
            if(newPwd !== "") {
                console.log(newPwd);
                await updateManagerPassword(newPwd);
            }
            navigate("/leaderManageGather?gather_id=" + transInfo.gather_id)
        }
    }
    let cnt = 0;
    useEffect(() => {
        getTransData();
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
            <div className={clsx(style.transOptionContainer)}>
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

            <div className = {clsx(style.modifyTransContainer)}>
                <div className={clsx(style.transInfoContainer)}>
                    <div className = {clsx(style.transNameContainer)}>
                        <label>Transaction Name: </label>
                        <br/>
                        <input type="text" defaultValue={transInfo.trans_name}
                        onBlur={checkTransName}
                        onClick={() => {
                            setTransNameErr("");
                        }}
                        />
                        <br/>
                        <div className={clsx(style.err)}>{transNameErr}</div>
                    </div>

                    
                </div>
                
                <div className = {clsx(style.managerInfoContainer, {
                    [style.hidden]: options !== 1
                })}>
                    <div className = {clsx(style.nameContainer)}>
                        <label>Manager Name: </label>
                        <br/>
                        <input type="text" defaultValue={transInfo.account_name}
                        onBlur={checkManagerName}
                        onClick={() => {
                            setManagerNameErr("");
                        }}
                        />
                        <br/>
                        <div className={clsx(style.err)}>{managerNameErr}</div>
                    </div>

                    <div className = {clsx(style.phoneContainer)}>
                        <label>Manager Phone: </label>
                        <input type="text" defaultValue={transInfo.account_phone}
                        onBlur={checkManagerPhone}
                        onClick={() => {
                            setManagerPhoneErr("");
                        }}
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
                        />
                        <br/>
                        <div className={clsx(style.err)}>{newPasswordErr}</div>
                    </div>
                </div>
            </div>

            <div className={clsx(style.confirmBtns)}>
                <div to = {`/leaderManageGather?gather_id=${transInfo.gather_id}`} className={clsx(style.saveBtn)}
                onClick={handleSubmit}
                >
                    Save
                </div>

                <div className={clsx(style.cancelBtn)}>
                    Cancel
                </div>
            </div>
        </Fragment>
        
    );
}

export default ModifyTransaction;