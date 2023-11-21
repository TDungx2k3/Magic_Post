import clsx from "clsx"
import style from "./Gather.module.scss"
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Gather(props) {

    
    const [confirmHidden, setConfirmHidden] = useState(true);
    const [isHide, setIsHide] = useState(true);
    return (
        <Fragment>
            <div className= {clsx(style.gatherContainer)}
            data-aos="zoom-in-up" data-aos-duration="1000">
                <Link to = {`/leaderManageGather?gather_id=${props.data.gatherId}`} className= {clsx(style.gatherInfo)}>
                    <div>
                        <label htmlFor="gatherName">Gather Name: </label>
                        <span id="gatherName">{props.data.gatherName}</span>
                    </div>
                    
                    <div className= {clsx(style.gatherManager)}>
                        <div>
                            <label>Gather Manager Name: </label>
                            <span className= {clsx(style.gatherManagerName)}>{props.data.gatherManagerName}</span>
                        </div>
                        <div>
                            <label>Gather Manager Phone: </label>
                            <span className= {clsx(style.gatherManagerPhone)}>{props.data.gatherManagerPhone}</span>
                        </div>
                        
                    </div>
                </Link>

                <div className= {clsx(style.gatherBtns)}>
                    <div className= {clsx(style.deleteBtn)} onClick={
                        () => {
                            setConfirmHidden(false);
                            setIsHide(false);
                        }
                    }>
                        <i className= "ti-trash" ></i>
                    </div>

                    <Link to = {`/modifyGather?gather_id=${props.data.gatherId}`} className= {clsx(style.modifyBtn)}>
                        <i className= "ti-reload"></i>
                    </Link>
                </div>
            </div>

            <div className={clsx(style.confirmDeleteGatherContainer, {[style.hidden] : confirmHidden , [style.hideAll] : isHide})} 
            onClick={() => {
                setConfirmHidden(true);
            }}
            data-aos="zoom-out-up" data-aos-duration="1000">
                <div className={clsx(style.contentCF)}
                onClick={(e) => {
                    setConfirmHidden(false);
                    e.stopPropagation();
                }}>
                    <h2>Are you sure to delete this gathering?</h2>
                    <p>This action is irreversible.</p>
                    <div className={clsx(style.confirmBtns)}>
                        <div className={clsx(style.yesBtn)}
                        onClick={(e) => {
                            setConfirmHidden(true);
                            e.stopPropagation();
                        }}
                        >Yes</div>
                        <div className={clsx(style.noBtn)}
                        onClick={(e) => {
                            setConfirmHidden(true);
                            e.stopPropagation();
                        }}
                        >No</div>
                    </div>
                </div>
                
            </div>
        </Fragment>
    );
}

export default Gather;