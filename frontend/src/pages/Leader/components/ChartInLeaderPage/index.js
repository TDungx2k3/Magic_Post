import clsx from "clsx";
import style from "./ChartInLeaderPage.module.scss";
import { useState, useEffect } from "react";
import ReactApexCharts from "react-apexcharts";
import axios from "axios";
import { format, subDays, parseISO } from "date-fns";

function ChartInLeaderPage() {
  // maxdate để lưu ngày gần nhất
  const [maxDate, setMaxDate] = useState();
  const [dates, setDates] = useState([]);
  const [listQuantityOrder, setListQuantityOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // get maxdate với set 7 ngày gần nhất vào dates
  const fetchData = async () => {
    try {
      const maxDateResponse = await axios.get("http://localhost:8080/leader/get-max-date");
      const maxDateValue = maxDateResponse.data;
      setMaxDate(maxDateValue);

      const dateMinusOneDay = subDays(parseISO(maxDateValue), 1);
      const dateMinusTwoDays = subDays(parseISO(maxDateValue), 2);
      const dateMinusThreeDays = subDays(parseISO(maxDateValue), 3);
      const dateMinusFourDays = subDays(parseISO(maxDateValue), 4);
      const dateMinusFiveDays = subDays(parseISO(maxDateValue), 5);
      const dateMinusSixDays = subDays(parseISO(maxDateValue), 6);

      const newDates = [
        format(dateMinusSixDays, "yyyy/MM/dd"),
        format(dateMinusFiveDays, "yyyy/MM/dd"),
        format(dateMinusFourDays, "yyyy/MM/dd"),
        format(dateMinusThreeDays, "yyyy/MM/dd"),
        format(dateMinusTwoDays, "yyyy/MM/dd"),
        format(dateMinusOneDay, "yyyy/MM/dd"),
        format(parseISO(maxDateValue), "yyyy/MM/dd")
      ];

      setDates(newDates);

      const listQuantityOrderData = await Promise.all(newDates.map(async (date) => await getQuantityOrderInAdate(date)));
      setListQuantityOrder(listQuantityOrderData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Dùng để get số lượng order trong 1 ngày
  const getQuantityOrderInAdate = async (date) => {
    try {
      const response = await axios.get("http://localhost:8080/leader/get-quantity-order-in-a-date", {
        params: {
          date,
        },
      });
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  // Lấy dữ liệu lần đầu khi vào page
  useEffect(() => {
    fetchData();
  }, []);

  // Updated dates
  useEffect(() => {
    console.log("Updated dates:", dates);
  }, [dates]);

  // Update listQuantityOrder
  useEffect(() => {
    console.log("Updated listQuantityOrder:", listQuantityOrder);
  }, [listQuantityOrder]);

  // Render khi tất cả dữ liệu sẵn sàng
  useEffect(() => {
    console.log("Loading state:", loading);
  }, [loading]);

  // Khởi tạo chartData
  const chartData = {
    series: [{ name: 'Quantity Orders', data: listQuantityOrder }],
    options: {
      chart: {
        type: 'bar',
        height: 500,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: dates,
      },
      yaxis: {
        title: {
          text: 'Items',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' items';
          },
        },
      },
    },
  };

  return (
    <div id={clsx(style.chart)} className={clsx(style.chartContainer)}>
      {loading ? (
        "Loading ..."
      ) : (
        <ReactApexCharts options={chartData.options} series={chartData.series} type="bar" height={500} />
      )}
    </div>
  );
}

export default ChartInLeaderPage;