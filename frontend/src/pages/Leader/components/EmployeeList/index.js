import clsx from "clsx"
import style from "./EmployeeList.module.scss"
import { Fragment, useEffect, useState } from "react";
import Employee from "../Employee"
import { Link } from "react-router-dom";
import axios from "axios";


function EmployeeList(props) {

    let employeeList = props.data;

    return (
        <Fragment>
            <div className={clsx(style.employeeListContainer)}>
                <div className={clsx(style.functionContainer)}>
                    <div className={clsx(style.searchBar)}>
                        <i className= "ti-search"></i>
                        <input type="text" placeholder="Search..."/>
                    </div>
                </div>

                {
                    employeeList.map((employee, index) => {
                        let employeeData = {
                            employeeId: employee.account_id,
                            employeeName: employee.account_name,
                            employeePhone: employee.account_phone,
                            employeeRole: employee.role_name,
                        }
                        return(
                            <Employee key={index} data={employeeData}/>
                        );
                    })
                }
            </div>
        </Fragment>
    );
}

export default EmployeeList;