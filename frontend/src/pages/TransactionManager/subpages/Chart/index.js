import React, { useState, useEffect, Fragment } from "react";
import ReactApexCharts from "react-apexcharts";
import clsx from "clsx";
import style from "./Chart.module.scss";
import axios from "axios";
import { format, subDays, max } from "date-fns";
import { useContext } from "react";
import { LoginContext } from "../../../../App";
import { useNavigate } from "react-router-dom";

const Chart = () => {
    const navigate = useNavigate();
    const userInfo = useContext(LoginContext);

    const [isFetchedDateData, setIsFetchedDateData] = useState(false);
    const [dates, setDates] = useState([]);

    const [rerender, setRerender] = useState(false);

    const handleDateData = async () => {
        try {
            let maxDateSent = await axios.get("http://localhost:8080/transaction-manager/get-max-date-sent-transaction",
                {
                    params: {
                        unit: userInfo.userInfo.uUnit
                    }
                }
            );

            let maxDateReceived = await axios.get("http://localhost:8080/transaction-manager/get-max-date-received-transaction",
                {
                    params: {
                        unit: userInfo.userInfo.uUnit
                    }
                }
            )

            console.log(maxDateReceived.data[0][0]["MAX(orders.date)"]);

            if (maxDateReceived.data[0][0]["MAX(orders.date)"] === null && maxDateSent.data[0][0]["MAX(orders.date)"] !== null) {
                maxDateReceived.data[0][0]["MAX(orders.date)"] = maxDateSent.data[0][0]["MAX(orders.date)"];
            } else if (maxDateReceived.data[0][0]["MAX(orders.date)"] !== null && maxDateSent.data[0][0]["MAX(orders.date)"] === null) {
                maxDateSent.data[0][0]["MAX(orders.date)"] = maxDateReceived.data[0][0]["MAX(orders.date)"];
            } else if (maxDateReceived.data[0][0]["MAX(orders.date)"] === null && maxDateSent.data[0][0]["MAX(orders.date)"] === null) {
                maxDateSent.data[0][0]["MAX(orders.date)"] = new Date();
                maxDateReceived.data[0][0]["MAX(orders.date)"] = new Date();
            }

            console.log(maxDateSent.data[0][0]["MAX(orders.date)"]);
            console.log(maxDateReceived.data[0][0]["MAX(orders.date)"]);

            maxDateSent = new Date(maxDateSent.data[0][0]["MAX(orders.date)"]);
            maxDateReceived = new Date(maxDateReceived.data[0][0]["MAX(orders.date)"]);
            console.log(maxDateSent);
            console.log(maxDateReceived);
            let maxDate = max([maxDateSent, maxDateReceived]);
            console.log(maxDate);

            setIsFetchedDateData(true);

            const dateMinusOneDay = subDays(maxDate, 1);
            const dateMinusTwoDays = subDays(maxDate, 2);
            const dateMinusThreeDays = subDays(maxDate, 3);
            const dateMinusFourDays = subDays(maxDate, 4);
            const dateMinusFiveDays = subDays(maxDate, 5);
            const dateMinusSixDays = subDays(maxDate, 6);

            setDates([format(dateMinusSixDays, "yyyy/MM/dd"), format(dateMinusFiveDays, "yyyy/MM/dd"), format(dateMinusFourDays, "yyyy/MM/dd"), format(dateMinusThreeDays, "yyyy/MM/dd"), format(dateMinusTwoDays, "yyyy/MM/dd"), format(dateMinusOneDay, "yyyy/MM/dd"), format(maxDate, "yyyy/MM/dd")]);
            setRerender(!rerender);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleDateData();
    }, [isFetchedDateData]);

    const fetchDataSentForDate = async (date) => {
        try {
            const response = await axios.get("http://localhost:8080/transaction-manager/count-order-sent-by-date"
                , {
                    params: {
                        date,
                        unit: userInfo.userInfo.uUnit
                    }
                }
            );
            return response.data[0]['COUNT(*)'];
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    const fetchDataReceivedForDate = async (date) => {
        try {
            const response = await axios.get("http://localhost:8080/transaction-manager/count-order-received-by-date"
                , {
                    params: {
                        date,
                        unit: userInfo.userInfo.uUnit
                    }
                }
            );
            return response.data[0]['COUNT(*)'];
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    // Sử dụng Promise.all để đợi tất cả các yêu cầu Axios hoàn thành
    const fetchData = async () => {
        console.log(dates);
        const promisesSent = dates.map((date) => (fetchDataSentForDate(date)));
        const promisesReceived = dates.map((date) => (fetchDataReceivedForDate(date)));
        const resultsSent = await Promise.all(promisesSent);
        const resultsReceived = await Promise.all(promisesReceived);
        console.log(resultsSent);

        // results là một mảng chứa kết quả tương ứng với mỗi ngày
        const updatedDataSent = resultsSent.map(result => result !== null ? result : 0);
        const updatedDataReceived = resultsReceived.map(result => result !== null ? result : 0);
        setDataSent(updatedDataSent);
        setDataReceived(updatedDataReceived);
        console.log(updatedDataSent);

        // Đặt allDataReady thành true để hiển thị biểu đồ
        setAllDataReady(true);
    };
    useEffect(() => {
        fetchData();
    }, [dates]);

    const handleBack = () => {
        navigate("/transaction-manager");
    }

    const [dataSent, setDataSent] = useState([]);
    const [dataReceived, setDataReceived] = useState([]);

    const [allDataReady, setAllDataReady] = useState(false);
    console.log(dataReceived);

    const [chartData, setChartData] = useState({
        series: [
            { name: 'Quantity Orders Sent', data: ['', '', '', '', '', '', ''] },
            { name: 'Quantity Orders Received', data: ['', '', '', '', '', '', ''] },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 500
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: ['', '', '', '', '', '', ''],
            },
            yaxis: {
                title: {
                    text: 'Items'
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + " items"
                    }
                }
            }
        }
    });

    useEffect(() => {
        // Chỉ chạy khi tất cả data đã sẵn sàng
        if (allDataReady) {
            // Tạo dữ liệu mới cho biểu đồ
            const newChartData = {
                series: [
                    { name: 'Quantity Orders Sent', data: dataSent },
                    // { name: 'Quantity Orders Received', data: [10, 5, 1, 8, 7, 10, 11] },
                    { name: 'Quantity Orders Received', data: dataReceived },
                ],
                options: {
                    chart: {
                        type: 'bar',
                        height: 500
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            endingShape: 'rounded'
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent']
                    },
                    xaxis: {
                        categories: dates,
                    },
                    yaxis: {
                        title: {
                            text: 'Items'
                        }
                    },
                    fill: {
                        opacity: 1
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return val + " items"
                            }
                        }
                    }
                }
            };

            // Cập nhật state cho biểu đồ
            setChartData(newChartData);
        }
    }, [allDataReady, dataSent]);

    return (
        <Fragment>
            <div id="chart" className={clsx(style.chartContainer)}>
                <ReactApexCharts options={chartData.options} series={chartData.series} type="bar" height={500} />
            </div>

            <button className={clsx(style.back)} onClick={handleBack}>
                Back
            </button>
        </Fragment>
    );
}

export default Chart;
