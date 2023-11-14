import clsx from "clsx"
import style from "./GatherList.module.scss"
import { Fragment } from "react";
import Gather from "../Gather"
import { Link } from "react-router-dom";

let gatherList = [
    {
        gatherName: "Bac",
        gatherManagerName: "Dung",
        gatherManagerPhone: "0329579903"
    },
    {
        gatherName: "Bac",
        gatherManagerName: "Dung",
        gatherManagerPhone: "0329579903"
    }
]

function GatherList() {
    return (
        <Fragment>
            <div className={clsx(style.gatherListContainer)}>
                <div className={clsx(style.functionContainer)}>
                    <div className={clsx(style.addBtn)}>
                        <i className= "ti-plus"></i>
                    </div>

                    <div className={clsx(style.searchBar)}>
                        <i className= "ti-search"></i>
                        <input type="text" placeholder="Search..."/>
                    </div>
                </div>

                {
                    gatherList.map((gather, index) => {
                        let gatherData = {
                            gatherName: gather.gatherName,
                            gatherManagerName: gather.gatherManagerName,
                            gatherManagerPhone: gather.gatherManagerPhone
                        }
                        return(
                            <Link to = "/" key = {index}>
                                <Gather data={gatherData}/>
                            </Link>
                            
                        );
                    })
                }
            </div>
        </Fragment>
    );
}

export default GatherList;