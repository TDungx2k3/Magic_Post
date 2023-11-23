import { Fragment, useState, useEffect, useContext } from "react";
import clsx from "clsx";
import style from './CreateGather.module.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../../../App";

function CreateGather() {
    const navigate = useNavigate();
    const { isLogin, setIsLogin, userInfo, setUserInfo} = useContext(LoginContext);
    // console.log(gatherId);
    
    const [rerender] = useState(true);
    const [options, setOptions] = useState(1);
    const [gatherNameErr, setGatherNameErr] = useState("");
    const [managerNameErr, setManagerNameErr] = useState("");
    const [managerPhoneErr, setManagerPhoneErr] = useState("");
    const [newPasswordErr, setNewPasswordErr] = useState("");

    const [gatherInfo, setGatherInfo] = useState(
        {
            gather_name: "",
            account_name: "",
            account_phone: "",
            account_password: ""
        }
    );

    const checkGatherName = () => {
        let gName = document.querySelector("." + style.gatherNameContainer + " input").value;
        // console.log(gName);
        if(gName === "") {
            setGatherNameErr("Please enter valid gather name!")
        }
    };

    const checkManagerName = () => {
        let mName = document.querySelector("." + style.nameContainer + " input").value;
        // console.log(gName);
        if(mName === "") {
            setManagerNameErr("Please enter valid manager name!")
        }
    };

    const checkManagerPhone = () => {
        let mPhone = document.querySelector("." + style.phoneContainer + " input").value;
        // console.log(gName);
        let phoneRegex = /^\d{10}$/;
        if(!mPhone.match(phoneRegex)) {
            setManagerPhoneErr("Please enter valid manager phone!")
        }
    };

    const checkNewPassword = () => {
        let newPwd = document.querySelector("." + style.newPasswordContainer + " input").value;
        if(!(newPwd === "")) {
            if (newPwd.length < 6) {
                setNewPasswordErr("Your password must be larger than 6 characters!")
            }
        }
    };

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

    const createGatherManager = async(mName, mPhone) => {
        console.log("cgm");
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
        console.log("cgme");
    }

    const updateManagerPassword = async(newMId, newPwd) => {
        console.log(newMId);
        console.log(newPwd);
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
    }
    
    const handleChange = (e) => {
        setGatherInfo((prev) => {
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
                    account_phone: gatherInfo.account_phone,
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
    }

    const getNewGatherId = async() => {
        try {
            const res = await axios.get("http://localhost:8080/leader/getMaxGatherId",);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

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
        
    }
    let cnt = 0;
    useEffect(() => {
        if(!isLogin && cnt === 0) {
            cnt ++;
            alert("You have to login before access this page!");
            navigate("/login");
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