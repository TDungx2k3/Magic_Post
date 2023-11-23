import clsx from "clsx"
import style from "./Employee.module.scss"
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Emplyee(props) {

    return (
        <Fragment>
            <div className= {clsx(style.employeeContainer)}
            data-aos="zoom-in-up" data-aos-duration="1000">
                <Link className= {clsx(style.employeeInfo)}>
                    <div>
                        <label>Employee Name: </label>
                        <span className= {clsx(style.emplyeeName)}>{props.data.employeeName}</span>
                    </div>
                    <div>
                        <label>Employee Phone: </label>
                        <span className= {clsx(style.employeePhone)}>{props.data.employeePhone}</span>
                    </div>
                    <div>
                        <label>Employee Role: </label>
                        <span className= {clsx(style.employeeRole)}>{props.data.employeeRole}</span>
                    </div>
                </Link>
            </div>
        </Fragment>
    );
}

export default Emplyee;