import clsx from "clsx"
import style from "./GatherList.module.scss"
import { Fragment, useEffect, useState } from "react";
import Gather from "../Gather"
import { Link } from "react-router-dom";
import axios from "axios";


function GatherList() {

    const [gatherList, setGatherList] = useState([])

    const [rerender] = useState(true);

    // Lấy tất cả điểm tập kết
    const getAllGathers = async(e) => {
        try {
            await axios
            .get("http://localhost:8080/leader/showAllGathers")
            .then((res) => {
                setGatherList(res.data);
                // console.log(res.data);
            })
        } catch (error) {
            console.log(error);
        }
    }

    // Thực hiện hàm khi load trang
    useEffect(() => {
        getAllGathers();
    }, [rerender]);

    return (
        <Fragment>
            <div className={clsx(style.gatherListContainer)}>
                <div className={clsx(style.functionContainer)}>
                    <Link to = '/createGather' className={clsx(style.addBtn)}>
                        <i className= "ti-plus"> </i>
                        <p>Create Gather</p>
                    </Link>

                    {/* <div className={clsx(style.searchBar)}>
                        <i className= "ti-search"></i>
                        <input type="text" placeholder="Search..."/>
                    </div> */}
                </div>

                {
                    gatherList.map((gather, index) => {
                        // console.log(gather);
                        let gatherData = {
                            gatherId: gather.gather_id,
                            gatherName: gather.gather_name,
                            gatherManagerName: gather.account_name,
                            gatherManagerPhone: gather.account_phone
                        };
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