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

    const [isFetchedDateData, setIsFetchedDateData] = useState(false); // Check xem đã get được dữ liệu ngày chưa
    const [dates, setDates] = useState([]); // Dùng để lưu lại các ngày, trong project là lấy 7 ngày gần nhất có đơn

    const [rerender, setRerender] = useState(false);

    // Dùng để get dữ liệu ngày trong database
    const handleDateData = async () => {
        try {
            // Lấy ra ngày gần đây nhất mà điểm tập kết gửi hàng đi
            let maxDateSent = await axios.get("http://localhost:8080/gathering-manager/get-max-date-sent-gather",
                {
                    params: {
                        unit: userInfo.userInfo.uUnit
                    }
                }
            );

            // Lấy ra ngày gần nhất mà điểm tập kết nhận hàng
            let maxDateReceived = await axios.get("http://localhost:8080/gathering-manager/get-max-date-received-gather",
                {
                    params: {
                        unit: userInfo.userInfo.uUnit
                    }
                }
            )

            // Để handle ra max date mà điểm tập kết nhận hoặc gửi hàng, nếu điểm tập kết nào không nhận và gửi hàng lần nào thì set thành ngày hiện tại
            if (maxDateReceived.data[0][0]["MAX(orders.date)"] === null && maxDateSent.data[0][0]["MAX(orders.date)"] !== null) {
                maxDateReceived.data[0][0]["MAX(orders.date)"] = maxDateSent.data[0][0]["MAX(orders.date)"];
            } else if (maxDateReceived.data[0][0]["MAX(orders.date)"] !== null && maxDateSent.data[0][0]["MAX(orders.date)"] === null) {
                maxDateSent.data[0][0]["MAX(orders.date)"] = maxDateReceived.data[0][0]["MAX(orders.date)"];
            } else if (maxDateReceived.data[0][0]["MAX(orders.date)"] === null && maxDateSent.data[0][0]["MAX(orders.date)"] === null) {
                maxDateSent.data[0][0]["MAX(orders.date)"] = new Date();
                maxDateReceived.data[0][0]["MAX(orders.date)"] = new Date();
            }

            maxDateSent = new Date(maxDateSent.data[0][0]["MAX(orders.date)"]);
            maxDateReceived = new Date(maxDateReceived.data[0][0]["MAX(orders.date)"]);

            let maxDate = max([maxDateSent, maxDateReceived]);

            setIsFetchedDateData(true);

            // Các biến bên dưới để lấy ra 6 ngày gần nhất so với maxDate
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

    // Get số lượng đơn hàng mà điểm giao dịch đã gửi đi theo 1 ngày chỉ định
    const fetchDataSentForDate = async (date) => {
        try {
            const response = await axios.get("http://localhost:8080/gathering-manager/get-quantity-orders-sent-in-a-date"
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

    // Get số lượng đơn hàng mà điểm giao dịch đã nhận theo 1 ngày chỉ định
    const fetchDataReceivedForDate = async (date) => {
        try {
            const response = await axios.get("http://localhost:8080/gathering-manager/get-quantity-orders-received-in-a-date"
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

        // results là một mảng chứa kết quả tương ứng với mỗi ngày
        const updatedDataSent = resultsSent.map(result => result !== null ? result : 0);
        const updatedDataReceived = resultsReceived.map(result => result !== null ? result : 0);
        setDataSent(updatedDataSent);
        setDataReceived(updatedDataReceived);

        // Đặt allDataReady thành true để hiển thị biểu đồ
        setAllDataReady(true);
    };
    useEffect(() => {
        fetchData();
    }, [dates]);

    // Khi bấm vào nút back thì quay lại trang gather-manager
    const handleBack = () => {
        navigate("/gather-manager");
    }

    const [dataSent, setDataSent] = useState([]); // Mảng này dùng để lưu số lượng đơn hàng mà điểm tập kết gửi đi theo từng ngày
    const [dataReceived, setDataReceived] = useState([]); // Mảng này dùng để lưu số lượng đơn hàng mà điểm tập kết nhận theo từng ngày

    const [allDataReady, setAllDataReady] = useState(false); // Check xem tất cả data đã được get thành công hết chưa

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
            // Trục x của biểu đồ
            xaxis: {
                categories: ['', '', '', '', '', '', ''],
            },
            // Trục y của biểu đồ
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
