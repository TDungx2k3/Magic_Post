import clsx from "clsx"
import style from "./Gather.module.scss"
import { Fragment } from "react";

function Gather(props) {
    return (
        <Fragment>
            <div className= {clsx(style.gatherContainer)}>
                <div className= {clsx(style.gatherInfo)}>
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
                </div>

                <div className= {clsx(style.gatherBtns)}>
                    <div className= {clsx(style.deleteBtn)}>
                        <i className= "ti-trash"></i>
                    </div>

                    <div className= {clsx(style.modifyBtn)}>
                        <i className= "ti-reload"></i>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Gather;