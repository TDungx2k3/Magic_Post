import { Fragment, useState, useEffect, useContext } from "react";
import clsx from "clsx";
import style from './CreateGather.module.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../../../App";

function CreateGather() {
    // Lấy thông tin đăng nhập
    const navigate = useNavigate();
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    // console.log(gatherId);
    
    // Xử lý lỗi
    const [rerender] = useState(true);
    const [options, setOptions] = useState(1);
    const [gatherNameErr, setGatherNameErr] = useState("");
    const [managerNameErr, setManagerNameErr] = useState("");
    const [managerPhoneErr, setManagerPhoneErr] = useState("");
    const [newPasswordErr, setNewPasswordErr] = useState("");

    // Lưu thông tin liên quan đến điểm tập kết
    const [gatherInfo, setGatherInfo] = useState(
        {
            gather_name: "",
            account_name: "",
            account_phone: "",
            account_password: ""
        }
    );

    // Chuẩn hóa tên điểm tập kết
    const gatherNameNormalize = (name) => {
        
        const tenChuanHoa = name.replace(/\s+/g, " ").trim();
        
        return tenChuanHoa.charAt(0).toUpperCase() + tenChuanHoa.slice(1);
    };

    // Check tên điểm tập kết
    const checkGatherName = () => {
        let gName = document.querySelector("." + style.gatherNameContainer + " input").value;
        // console.log(gName);
        if(gName === "") {
            setGatherNameErr("Please enter valid gather name!")
        }
        else {
            document.querySelector("." + style.gatherNameContainer + " input").value = gatherNameNormalize(gName);
        }
    };

    // Chuẩn hóa tên quản lý
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
    }

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

    // Tạo điểm tập kết mới
    const createGather = async(gId, gName, mId) => {
        console.log("cg");
        try {
            const response = await axios.post("http://localhost:8080/leader/createGather",
            {
                gather_id: gId,
                gather_name: gName,
                account_id: mId,
            }
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Tạo tài khoản trưởng điểm tập kết
    const createGatherManager = async(mName, mPhone) => {
        // console.log("cgm");
        try {
            await axios.post("http://localhost:8080/leader/createGatherManager",
            {
                manager_name: mName,
                manager_phone: mPhone
            }
            );
            
            
        } catch (error) {
            console.log(error);
        }
        // console.log("cgme");
    };

    // Cập nhật mật khẩu
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
    
    // Xử lý nhập inputs
    const handleChange = (e) => {
        setGatherInfo((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    // Đếm số điện thoại xem có trùng không
    const checkCntPhone = async(e) => {
        try {
            const res = await axios.get("http://localhost:8080/leader/getCntPhone",
            {
                params :{
                    account_phone: gatherInfo.account_phone,
                }
            }
            );
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    // Lấy ID tài khoản mới nhất
    const getNewestAID = async() => {
        try {
            const res = await axios.get("http://localhost:8080/leader/getNewestAId",);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    // Lấy ID điểm tập kết mới nhất
    const getNewGatherId = async() => {
        try {
            const res = await axios.get("http://localhost:8080/leader/getMaxGatherId",);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    // Tạo điểm tập kết mới 
    const handleSubmit = async(e) => {
        
        checkGatherName();
        checkManagerName();
        checkManagerPhone();
        checkNewPassword();

        let cnt = await checkCntPhone();
        if(cnt > 0) {
            alert("This phone number is already used by another account");
        }
        else if(gatherNameErr === ""
        && managerNameErr === ""
        && managerPhoneErr === ""
        && newPasswordErr === "" ) {
            let newMId = await getNewestAID() + 1;
            let newGId = await getNewGatherId();
            if(window.confirm("Click OK to create gather and manager with infomation below.")) {

                await Promise.all([
                    createGatherManager(gatherInfo.account_name, gatherInfo.account_phone),
                    createGather(newGId, gatherInfo.gather_name, 5),
                    console.log(1),
                ]);
                
            }
            
            if(gatherInfo.account_password !== "") {
                // console.log(newPwd);
                await updateManagerPassword(newMId, gatherInfo.account_password);
            }

            console.log(newMId);
            await new Promise(resolve => setTimeout(resolve, 100));
            // update account_id in gatherings
            await axios.post("http://localhost:8080/leader/updateAccountInGather",
            {
                account_id: newMId,
                gather_id: newGId,  
            }
            );
            console.log(4);
            // update unit in accounts
            await axios.post("http://localhost:8080/leader/updateUnitInAccount",
            {
                account_id: newMId,
                unit: newGId,  
            }
            );
            navigate("/leader");
        }
        
    };
    
    // Check xem user có phải là leader hay không
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
            <div className={clsx(style.gatherOptionContainer)}>
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

            <div className = {clsx(style.modifyGatherContainer)}>
                <div className={clsx(style.gatherInfoContainer)}>
                    <div className = {clsx(style.gatherNameContainer)}>
                        <label>Gather Name: </label>
                        <br/>
                        <input type="text" placeholder="Enter Gather Name"
                        onBlur={checkGatherName}
                        onClick={() => {
                            setGatherNameErr("");
                        }}
                        name="gather_name"
                        onChange={handleChange}
                        />
                        <br/>
                        <div className={clsx(style.err)}>{gatherNameErr}</div>
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

export default CreateGather;