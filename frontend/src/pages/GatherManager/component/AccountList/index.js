import { Fragment, useEffect, useState } from "react";
import ManageAccountEmployee from "../ManageAccountEmpoyee"
import axios from "axios";
import { LoginContext } from "../../../../App";
import { useContext } from "react";

function AccountList() {
    const { userInfo } = useContext(LoginContext);

    const [accountList, setAccountList] = useState([])
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [rerender, setRerender] = useState(true);

    const getAllAccounts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/gathering-manager/get-all-employee", {
                params: {
                    unit: userInfo.uUnit
                }
            });
            setAccountList(response.data);
            console.log(response.data);
            setHasFetchedData(true);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!hasFetchedData) {
            getAllAccounts();
            setRerender(false);
        }
    }, [rerender, hasFetchedData]);

    return (
        // <Fragment>
        //     {
        //         accountList.map((accounts, index) => {
        //             let accountData = {
        //                 accountId: accounts.account_id,
        //                 accountName: accounts.account_name,
        //                 accountPhone: accounts.account_phone,
        //                 accountPassword: accounts.account_password,
        //                 roleId: accounts.role_id,
        //                 unit: accounts.unit
        //             };
        //             return (
        //                 <ManageAccountEmployee key={index} data={accountData} />
        //             );  
        //         })
        //     }
        // </Fragment>
        <Fragment>
            <ManageAccountEmployee accountList={accountList} />
        </Fragment>
    );
}

export default AccountList;
