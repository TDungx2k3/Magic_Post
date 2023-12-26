import clsx from "clsx";
import style from "./ChartInLeaderPage.module.scss";
import { useState, useEffect } from "react";
import ReactApexCharts from "react-apexcharts";
import axios from "axios";
import { format, subDays, max, parseISO } from "date-fns";

function ChartInLeaderPage() {
    const [maxDate, setMaxDate] = useState();
    const [isGotDates, setIsGotDates] = useState(false);

    const getMaxDate = async () => {
        try {
            const maxDate = await axios.get("http://localhost:8080/leader/get-max-date");
            setMaxDate(maxDate.data);
            const dateMinusOneDay = subDays(parseISO(maxDate.data), 1);
            const dateMinusTwoDays = subDays(parseISO(maxDate.data), 2);
            const dateMinusThreeDays = subDays(parseISO(maxDate.data), 3);
            const dateMinusFourDays = subDays(parseISO(maxDate.data), 4);
            const dateMinusFiveDays = subDays(parseISO(maxDate.data), 5);
            const dateMinusSixDays = subDays(parseISO(maxDate.data), 6);

            setDates([format(dateMinusSixDays, "yyyy/MM/dd"), format(dateMinusFiveDays, "yyyy/MM/dd"), format(dateMinusFourDays, "yyyy/MM/dd"), format(dateMinusThreeDays, "yyyy/MM/dd"), format(dateMinusTwoDays, "yyyy/MM/dd"), format(dateMinusOneDay, "yyyy/MM/dd"), format(parseISO(maxDate.data), "yyyy/MM/dd")]);
            setIsGotDates(true);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getMaxDate();
    }, [isGotDates]);

    const [dates, setDates] = useState([]);

    const [isGotQuantityOrderInADate, setIsGotQuantityOrderInADate] = useState(false);

    const getQuantityOrderInAdate = async (date) => {
        try {
            const response = await axios.get("http://localhost:8080/leader/get-quantity-order-in-a-date"
                , {
                    params: {
                        date,
                    }
                }
            );
            setIsGotQuantityOrderInADate(true);
            return response.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    const [listQuantityOrder, setListQuantityOrder] = useState([]);
    const [isGotListQuantityOrder, setIsGotListQuantityOrder] = useState(false);

    const [isReady, setIsReady] = useState(false);

    const getListQuantityOrder = async () => {
        const listQuantityOrder = await Promise.all(dates.map((date) => getQuantityOrderInAdate(date)));
        setListQuantityOrder(listQuantityOrder);
        setIsGotListQuantityOrder(true);
        setIsReady(true);
    }

    useEffect(() => {
        getListQuantityOrder();
    }, [isGotListQuantityOrder]);

    console.log(listQuantityOrder);

    const [chartData, setChartData] = useState({
        series: [
            { name: 'Quantity Orders', data: ['', '', '', '', '', '', ''] },
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
        // Tạo dữ liệu mới cho biểu đồ
        if (isReady) {
            // Tạo dữ liệu mới cho biểu đồ
            const newChartData = {
                series: [
                    { name: 'Quantity Orders', data: listQuantityOrder },
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
    }, [isGotListQuantityOrder, listQuantityOrder]);

    return (
        <div id={clsx(style.chart)} className={clsx(style.chartContainer)}>
            <ReactApexCharts options={chartData.options} series={chartData.series} type="bar" height={500} />
        </div>
    )
}

export default ChartInLeaderPage;
