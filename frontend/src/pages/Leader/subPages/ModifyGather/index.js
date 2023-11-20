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

    const [gatherInfo, setGatherInfo] = useState(
        {
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
                        <input type="text" defaultValue={gatherInfo.gather_name}/>
                        <br/>
                        <div className={clsx(style.err)}></div>
                    </div>

                    
                </div>
                
                <div className = {clsx(style.managerInfoContainer, {
                    [style.hidden]: options !== 1
                })}>
                    <div className = {clsx(style.nameContainer)}>
                        <label>Manager Name: </label>
                        <br/>
                        <input type="text" defaultValue={gatherInfo.account.account_name}/>
                        <br/>
                        <div className={clsx(style.err)}></div>
                    </div>

                    <div className = {clsx(style.phoneContainer)}>
                        <label>Manager Phone: </label>
                        <input type="text" defaultValue={gatherInfo.account.account_phone}/>
                        <br/>
                        <div className={clsx(style.err)}></div>
                    </div>
                </div>

                <div className = {clsx(style.changePasswordContainer, {
                    [style.hidden]: options !== 2
                })}>
                    <div className = {clsx(style.nameContainer)}>
                        <label>Manager New Password: </label>
                        <br/>
                        <input type="text" placeholder="Enter new password!"/>
                        <br/>
                        <div className={clsx(style.err)}></div>
                    </div>
                </div>
            </div>

            <div className={clsx(style.confirmBtns)}>
                <div className={clsx(style.saveBtn)}>
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