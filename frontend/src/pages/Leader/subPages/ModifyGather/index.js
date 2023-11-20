import { Fragment, useState, useEffect } from "react";
import clsx from "clsx";
import style from './ModifyGather.module.scss';
import { useLocation } from "react-router-dom";
import axios from "axios";

function ModifyGather() {

    const location = useLocation();
    const gatherId = new URLSearchParams(location.search).get("gather_id");
    // console.log(gatherId);
    
    const [rerender] = useState(true);
    const [options, setOptions] = useState(1);
    const [gatherNameErr, setGatherNameErr] = useState("");
    const [managerNameErr, setManagerNameErr] = useState("");
    const [managerPhoneErr, setManagerPhoneErr] = useState("");
    const [newPasswordErr, setNewPasswordErr] = useState("");

    const [gatherInfo, setGatherInfo] = useState(
        {
            account_id: "",
            gather_name: "",
            account: {
                account_name: "",
                account_phone: ""
            }
        }
    );

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

    const handleSubmit = () => {
        let gName = document.querySelector("." + style.gatherNameContainer + " input").value;
        let mName = document.querySelector("." + style.nameContainer + " input").value;
        let mPhone = document.querySelector("." + style.phoneContainer + " input").value;
        let newPwd = document.querySelector("." + style.newPasswordContainer + " input").value;

        checkGatherName();
        checkManagerName();
        checkManagerPhone();
        checkNewPassword();

        if(gatherNameErr === ""
        && managerNameErr === ""
        && managerPhoneErr === ""
        && newPasswordErr === "" ) {
            updateGather(gName);
            updateManager(mName, mPhone);
            if(newPwd !== "") {
                console.log(newPwd);
                updateManagerPassword(newPwd);
            }
        }
    }
    
    useEffect(() => {
        getGatherData();
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
                        <input type="text" defaultValue={gatherInfo.account.account_name}
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
                        <input type="text" defaultValue={gatherInfo.account.account_phone}
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
                <div className={clsx(style.saveBtn)}
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

export default ModifyGather;