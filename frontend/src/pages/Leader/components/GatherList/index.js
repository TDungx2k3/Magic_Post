import clsx from "clsx"
import style from "./GatherList.module.scss"
import { Fragment, useEffect, useState } from "react";
import Gather from "../Gather"
import { Link } from "react-router-dom";
import axios from "axios";


function GatherList() {

    const [gatherList, setGatherList] = useState([])

    const [rerender] = useState(true);

    const getAllGathers = async(e) => {
        try {
            await axios
            .get("http://localhost:8080/leader/showAllGathers")
            .then((res) => {
                setGatherList(res.data);
                console.log(res.data);
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllGathers();
    }, [rerender]);

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
                            gatherId: gather.gather_id,
                            gatherName: gather.gather_name,
                            gatherManagerName: gather.account.account_name,
                            gatherManagerPhone: gather.account.account_phone
                        }
                        return(
                            <Gather key={index} data={gatherData}/>
                        );
                    })
                }
            </div>
        </Fragment>
    );
}

export default GatherList;