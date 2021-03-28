import Chart from "chart.js";
import "./portfolioGrowthGraphStyle.css";
import { useEffect, useState } from "react";
import axios from "axios";

/**
 * PortfolioGrowthGraph is a component that represents the graph on a page
 * @param {Array} tickerSymbol is a array of ticker symbols of the stocks
 * the user owns
 * @param {Array} shares is an array the amount of the stocks the user owns
 */
const PortfolioGrowthGraph = ({ tickerSymbols, shares }) => {
  const [graphData, setGraphData] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);
  const [intervals, setIntervals] = useState("5m");
  const [range, setRange] = useState("1d");

  /**
   * useEffect here is being used to grab the closing price of the
   * stock according the chosen range
   */
  useEffect(() => {
    if (tickerSymbols.length !== 0) {
      const options = {
        method: "GET",
        url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark",
        params: {
          symbols: tickerSymbols.join(","),
          interval: intervals,
          range: range,
        },
        headers: {
          "x-rapidapi-key":
            "453fc3a354msh27d132f07bd85d1p19b49djsnbdbf84ff7b1a",
          "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          parseGraphData(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [tickerSymbols, range, intervals, setIntervals, setRange]);

  /**
   * parseGraphData grabs the closing price and
   * the closing time of each stock and passes the information
   * to the makeDataSet to format everything properly
   * @param {JSON Object} data is the information returned by the
   * get-sparks API call
   */
  const parseGraphData = (data) => {
    let stocks = [];
    let timeStamps = [];
    let maxTimeStampRange = [];
    let maxLength = 0;
    for (let i = 0; i < tickerSymbols.length; i++) {
      stocks.push(data[tickerSymbols[i]].close);
      timeStamps.push(data[tickerSymbols[i]].timestamp);

      maxLength = Math.max(maxLength, data[tickerSymbols[i]].timestamp.length);
    }

    for (let k = 0; k < timeStamps.length; k++) {
      if (timeStamps[k].length == maxLength) {
        maxTimeStampRange = timeStamps[k];
        break;
      }
    }

    for (let j = 0; j < stocks.length; j++) {
      while (stocks[j].length != maxLength) {
        stocks[j].push(stocks[stocks[j].length - 1]);
      }
    }

    const totalPortfolioPrice = [];

    let col = 0;

    while (col < maxLength) {
      let partialPortfolioPrice = 0;
      let row = 0;
      while (row < stocks.length) {
        partialPortfolioPrice += stocks[row][col] * shares[row];
        row += 1;
      }
      totalPortfolioPrice.push(parseFloat(partialPortfolioPrice.toFixed(2)));
      col += 1;
    }

    makeDataSet(totalPortfolioPrice, maxTimeStampRange);
  };

  /**
   * makeDataSet formats the timeStamp to be sent to the Graph Component
   * @param {Array} totalPortfolioPrice is an array filled with total closing price
   * of stock on requested range
   * @param {Array} timeStamps is an array filled with the time stamps of
   * a stock closing time
   */
  const makeDataSet = (totalPortfolioPrice, timeStamps) => {
    let data = [];
    let formattedTimeStamps = [];
    for (let i = 0; i < totalPortfolioPrice.length; i++) {
      let date = new Date(1000 * timeStamps[i]);

      const time =
        date
          .toLocaleTimeString()
          .substring(0, date.toLocaleTimeString().length - 6) +
        " " +
        date
          .toLocaleTimeString()
          .substring(
            date.toLocaleTimeString().length - 2,
            date.toLocaleTimeString().length
          );
      const dayMonth = date
        .toDateString()
        .substring(4, date.toDateString().length);
      let point = {};
      if (range === "1d" || range === "5d") {
        formattedTimeStamps.push(dayMonth + ", " + time);
        point = {
          x: dayMonth + ", " + time,
          y: totalPortfolioPrice[i],
        };
      } else {
        formattedTimeStamps.push(dayMonth);
        point = {
          x: dayMonth,
          y: totalPortfolioPrice[i],
        };
      }

      data.push(point);
    }

    setTimeStamps(formattedTimeStamps);
    setGraphData(data);
  };

  var myChart;
  /**
   * useEffect here is being used to use Chart.js to make the chart
   * of the portfolio growth
   */
  useEffect(() => {


    
    const ctx = document.getElementById("myChart");

    if (myChart) {
      myChart.destroy();
    }

    let draw = Chart.controllers.line.prototype.draw;
Chart.controllers.line = Chart.controllers.line.extend({
    draw: function() {
        draw.apply(this, arguments);
        let ctx = this.chart.chart.ctx;
        let _stroke = ctx.stroke;
        ctx.stroke = function() {
            ctx.save();
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            _stroke.apply(this, arguments)
            ctx.restore();
        }
    }
});

Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
   draw: function(ease) {
      Chart.controllers.line.prototype.draw.call(this, ease);

      if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
         var activePoint = this.chart.tooltip._active[0],
             ctx = this.chart.ctx,
             x = activePoint.tooltipPosition().x,
             topY = this.chart.scales['y-axis-0'].top,
             bottomY = this.chart.scales['y-axis-0'].bottom;

         // draw line
         ctx.save();
         ctx.beginPath();
         ctx.moveTo(x, topY);
         ctx.lineTo(x, bottomY);
         ctx.lineWidth = 2;
         ctx.strokeStyle = 'black';
         ctx.stroke();
         ctx.restore();
      }
   }
});


    myChart = new Chart(ctx, {
      type: "LineWithLine",
      data: {
        labels: timeStamps,
        datasets: [
          {
            data: graphData,
            borderColor: "black",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },

              ticks: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        elements:{
          point: {
          radius: 0,
        }
      },
        responsive: true,
        

        maintainAspectRatio: true,
        tooltips: {
           mode:"nearest",
          intersect: false,
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel;
            },
          },
        },
      },
    });

  
  }, [graphData, myChart]);

  /**
   * changeRange updates the time range for the growth of the stock the
   * user wants to see
   * @param {Event} e represents the event that triggers the function
   */
  const changeRange = (e) => {
    document.getElementById("chart-holder").innerHTML = "&nbsp;";
    document.getElementById("chart-holder").innerHTML =
      '<canvas id="myChart" width="400px" height="400px"></canvas>';
    var ctx = document.getElementById("myChart").getContext("2d");

    let range = document.getElementById("range").selectedOptions[0].value;
    console.log(range);
    if (range === "1d") {
      setIntervals("5m");
    } else if (range === "5d") {
      setIntervals("15m");
    } else if (
      range === "3mo" ||
      range === "6mo" ||
      (range === range) === "1y"
    ) {
      setIntervals("1d");
    } else if (range === "5y") {
      setIntervals("1mo");
    } else if (range === "max") {
      setIntervals("3mo");
    }
    setRange(range);
  };

  return (
    <div className="graph-container">
      <div className="label-container margin-top">
        <h1 className="label">Portfolio Growth</h1>
      </div>
      <div className="range-form-container">
        <select id="range" name="range">
          <option value="1d">1D</option>
          <option value="5d">5D</option>
          <option value="3mo">3MO</option>
          <option value="6mo">6MO</option>
          <option value="1y">1Y</option>
          <option value="5y">5Y</option>
          <option value="max">MAX</option>
        </select>
        <input
          type="submit"
          className="apply-button"
          onClick={changeRange}
        ></input>
      </div>
      <div id="chart-holder">
        <canvas id="myChart" width="400px" height="400px"></canvas>
      </div>
    </div>
  );
};

export default PortfolioGrowthGraph;
