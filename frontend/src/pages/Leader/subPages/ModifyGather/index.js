import { Fragment, useState, useEffect, useContext } from "react";
import clsx from "clsx";
import style from './ModifyGather.module.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../../../App";

function ModifyGather() {

    // Lấy thông tin đăng nhập
    const navigate = useNavigate();
    const location = useLocation();
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    const gatherId = new URLSearchParams(location.search).get("gather_id");
    // console.log(gatherId);
    
    // Xử lý lỗi
    const [rerender] = useState(true);
    const [options, setOptions] = useState(1);
    const [gatherNameErr, setGatherNameErr] = useState("");
    const [managerNameErr, setManagerNameErr] = useState("");
    const [managerPhoneErr, setManagerPhoneErr] = useState("");
    const [newPasswordErr, setNewPasswordErr] = useState("");

    // Lưu thông tin điểm tập kết
    const [gatherInfo, setGatherInfo] = useState(
        {
            account_id: "",
            gather_name: "",
            account_name: "",
            account_phone: ""
        }
    );

    // Lấy thông tin điểm tập kết
    const getGatherData = async(e) => {
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
                console.log(res.data);
                setGatherInfo(res.data[0])
            })
        } catch (error) {
            console.log(error);
        }
    };

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

    // Chuẩn hóa tên người quản lý điểm tập kết
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
        let newPwd = document.querySelector("." + style.newPasswordContainers + " input").value;
        console.log(newPwd);
        if(!(newPwd === "")) {
            if (newPwd.length < 6) {
                setNewPasswordErr("Your password must be more than 6 characters!")
            }
            else if(newPwd.length > 30) {
                setNewPasswordErr("Your password must be less than 30 characters!")
            }
        }
    };

    // Cập nhật điểm tập kết
    const updateGather = async(gName) => {
        try {
            await axios.post("http://localhost:8080/leader/updateGather",
            {
                gather_id: gatherId,
                gather_name: gName
            }
            )
        } catch (error) {
            console.log(error);
        }
    };

    // Cập nhật tài khoản quản lý
    const updateManager = async(mName, mPhone) => {
        try {
            await axios.post("http://localhost:8080/leader/updateManager",
            {
                manager_id: gatherInfo.account_id,
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
                manager_id: gatherInfo.account_id,
                new_password: newPwd
            }
            )
        } catch (error) {
            console.log(error);
        }
    }

    // Đếm số lượng account theo phone
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
    }

    // Xử lý sửa thông tin điểm tập kết
    const handleSubmit = async(e) => {
        let gName = document.querySelector("." + style.gatherNameContainer + " input").value;
        let mName = document.querySelector("." + style.nameContainer + " input").value;
        let mPhone = document.querySelector("." + style.phoneContainer + " input").value;
        let newPwd = document.querySelector("." + style.newPasswordContainers + " input").value;

        checkGatherName();
        checkManagerName();
        checkManagerPhone();
        checkNewPassword();

        let cnt = await checkCntPhone();
        if(cnt > 0 && mPhone !== gatherInfo.account_phone) {
            alert("This phone number is already used by another account");
        }
        else if(gatherNameErr === ""
        && managerNameErr === ""
        && managerPhoneErr === ""
        && newPasswordErr === "" ) {
            alert("Click OK to update gather and manager with infomation below.");
            await updateGather(gName);
            await updateManager(mName, mPhone);
            console.log(1);
            if(newPwd !== "") {
                console.log(newPwd);
                await updateManagerPassword(newPwd);
            }
            navigate("/leader");
        }
    }

    // Check user có phải là leader hay không
    let cnt = 0;
    useEffect(() => {
        getGatherData();
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
                        <input type="text" defaultValue={gatherInfo.gather_name}
                        placeholder="Enter Gather Name!"
                        onBlur={checkGatherName}
                        onClick={() => {
                            setGatherNameErr("");
                        }}
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
                        <input type="text" defaultValue={gatherInfo.account_name}
                        placeholder="Enter Manager Name!"
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
                        <input type="text" defaultValue={gatherInfo.account_phone}
                        placeholder="Enter Manager Phone Number!"
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
                    <div className = {clsx(style.newPasswordContainers)}>
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
                <div to = {`/leader`} className={clsx(style.saveBtn)}
                onClick={(e) => {
                    handleSubmit(e);
                }}
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

export default ModifyGather;