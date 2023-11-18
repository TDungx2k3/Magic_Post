import ReactApexCharts from "react-apexcharts";
import React, {Component} from "react";
import { ReactDOM } from "react";
import clsx from "clsx";
import style from "./Chart.module.scss";

// Cài đặt bên ngoài nếu k chạy đc
//npm install apexcharts --save
//npm install --save react-apexcharts apexcharts

// Cách dùng ở trang khác
// import ApexChart from "../../components/Chart";
// Đặt vào thẻ ApexChart
// Muốn thay đổi dữ liệu biểu đồ thì thêm ở trang khác đấy các data series(thử rồi) và options(chưa thử) như định dạng state ban đầu
// Sau đó cmt khai báo mặc định (đừng xóa) rồi đổi ở đây thành series: props.series || [] như dưới
// bỏ data truyền vào thẻ ApexChart series={dataSeries} 
//options={dataOptions} chưa thử options


class ApexChart extends Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: 'Net Profit',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
          name: 'Revenue',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
          name: 'Free Cash Flow',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }],

        //series: props.series || [],
        //options: props.options || [],

        options: {
          chart: {
            type: 'bar',
            height: 350
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
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          },
          yaxis: {
            title: {
              text: '$ (thousands)'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "$ " + val + " thousands"
              }
            }
          }

        },
      };
    }

  
    render() {
      return (
        <div id="chart" className={style.chartContainer}>
        <ReactApexCharts options={this.state.options} series={this.state.series} type="bar" height={350} />
        </div>
      );
    }
}

export default ApexChart;