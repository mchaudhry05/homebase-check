import Chart from "chart.js";
import "./graphStyle.css";
import { useEffect, useState } from "react";

/**
 * Graph is a component that represents the graph on a page
 * @param {Array} timeStamps is a array of time stamps for requested range
 * @param {Array} graphData is an array of JSON objects representing the
 * x and y points
 * @param {Function} setRange is a function that sets the range of the
 * growth the user would like ot see
 * @param {Function} setIntervals is  function that sets the interval
 * that should be used for requested time range
 */
const Graph = ({ timeStamps, graphData, setRange, setIntervals }) => {
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

    myChart = new Chart(ctx, {
      type: "line",
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
        responsive: true,

        maintainAspectRatio: true,
        tooltips: {
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

export default Graph;
