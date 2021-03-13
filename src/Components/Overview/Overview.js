import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery, useEntity } from "homebase-react";
import "./overviewStyle.css";
import Graph from "../Graph/Graph";

/**
 * Overview is a component that represents the the overview page
 * of the application. On the overview page, the user has access
 * to the growth of their portfolio overall and other useful
 * statistics about their portfolio.
 *
 */
const Overview = () => {
  const [totalInvested, setTotalInvested] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [tickerSymbols, setTickerSymbols] = useState([]);
  const [shares, setShares] = useState([]);
  const [buyPrice, setBuyPrice] = useState([]);
  const [tickers, setTickers] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);
  const [intervals, setIntervals] = useState("5m");
  const [range, setRange] = useState("1d");
  const [currentUser] = useEntity({ identity: "currentUser" });

  /**
   * Using Homebase's useQuery API call to get all the stocks
   * the user owns
   */
  const [allStocks] = useQuery({
    $find: "stock",
    $where: { stock: { user: currentUser.get("id") } },
  });

  /**
   * useEffect here is being used to grab all of the stocks
   * from the results of the query and parse certain information
   * about the stocks as needed, while also making an API
   * call to get the user's currrent total amount invested
   */
  useEffect(() => {
    setStocks(allStocks);
    const tickerSymbols = [];
    const buyPricePerStock = [];
    const sharesPerStock = [];

    allStocks.map((stock) => {
      tickerSymbols.push(stock.get("tickerSymbol"));
      sharesPerStock.push(stock.get("shares"));
      buyPricePerStock.push(stock.get("buyPrice"));
    });

    setShares(sharesPerStock);
    setBuyPrice(buyPricePerStock);

    if (allStocks.length !== 0) {
      const options = {
        method: "GET",
        url:
          "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
        params: { region: "US", symbols: tickerSymbols.join(",") },
        headers: {
          "x-rapidapi-key":
            "453fc3a354msh27d132f07bd85d1p19b49djsnbdbf84ff7b1a",
          "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          parseResults(
            response.data.quoteResponse.result,
            sharesPerStock,
            buyPricePerStock
          );
          setTickerSymbols(tickerSymbols);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [allStocks]);

  /**
   * parseResults take the result from the API call to calculate
   * the percentage growth of a user's portfolio as the total amount
   * they have invested (market value of portfolio)
   * @param {Array} stockQuotes is an array with the current prices of the stocks
   * @param {Array} shares is an array with the number of stocks per stock
   * @param {Array} buyPrice is an array with the user's buy price of each stock
   */
  const parseResults = (stockQuotes, shares, buyPrice) => {
    let marketValue = 0;
    let costBasis = 0;

    stockQuotes.map((stock, index) => {
      marketValue += stock.ask * shares[index];
      costBasis += buyPrice[index] * shares[index];
    });

    const growthPercentage = (marketValue - costBasis) / costBasis;

    setGrowth(Math.round(growthPercentage * 100, 2));
    setTotalInvested(Math.round(marketValue), 2);
  };

  /**
   * useEffect here is being used to make an API call that
   * will help to determine the user's monthly and yearly
   * earnings from their diviend investments
   */
  useEffect(() => {
    if (tickerSymbols.length != 0) {
      tickerSymbols.map((tickerSymbol, index) => {
        const options = {
          method: "GET",
          url:
            "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
          params: { symbol: tickerSymbol, region: "US" },
          headers: {
            "x-rapidapi-key":
              "453fc3a354msh27d132f07bd85d1p19b49djsnbdbf84ff7b1a",
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
          },
        };

        axios
          .request(options)
          .then(function (response) {
            updateMonthlyIncome(
              response.data.calendarEvents.dividendDate,
              response.data.defaultKeyStatistics.lastDividendValue,
              shares[index],
              index
            );
            updateAnnualIncome(
              response.data.summaryDetail.trailingAnnualDividendRate,
              shares[index],
              index
            );
          })
          .catch(function (error) {
            console.error(error);
          });
      });
    }
  }, [tickerSymbols, shares]);

  /**
   * updateAnnualIncome adds the income from one stock to the overall annualIncome
   * the user will make from their investments
   * @param {Array} trailingAnnualDividendRate the diviend rate for said stock
   * @param {Arrat} shares an array with the number of shares per stock
   * @param {Integer} index to locate the number of shares for said stock inside
   * the shares array
   */
  let partialAnnualIncome = 0;
  const updateAnnualIncome = (trailingAnnualDividendRate, shares, index) => {
    if (trailingAnnualDividendRate.fmt) {
      partialAnnualIncome +=
        parseFloat(trailingAnnualDividendRate.fmt) * shares;
    } else {
    }

    setAnnualIncome(partialAnnualIncome);
  };

  /**
   *
   * @param {String} diviendDate is the date of when the user will get their
   * diviend
   * @param {String} diviendValue is the amount of the diviend per stock
   * @param {Array} shares is an array wit the number of shares per stock
   * @param {Integer} index is an integer values used to help with indexing in shares array
   */
  let partialMonthlyIncome = 0;
  const updateMonthlyIncome = (diviendDate, diviendValue, shares, index) => {
    var date = new Date();
    const month = date.getMonth();

    if (diviendDate.fmt) {
      const diviendMonth = parseInt(diviendDate.fmt.substring(6, 7));

      const value = parseFloat(diviendValue.fmt);
      if (diviendDate && month === diviendMonth) {
        partialMonthlyIncome += value * shares;
      }
    }

    if (index === allStocks.length - 1) {
      setMonthlyIncome(partialMonthlyIncome);
    } else {
    }
  };

  /**
   * useEffect here is being used to force the page to reload
   * this will help to calculate accurate monthly and annual
   * income prices
   */
  useEffect(() => {}, [monthlyIncome, annualIncome]);

  /**
   * useEffect here is being used to grab the closing price of the
   * stock according the chosen range
   */
  useEffect(() => {
    setTickers(tickerSymbols);

    console.log(range);
    console.log(intervals);
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
  }, [annualIncome, range, intervals, setIntervals, setRange]);

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

  return (
    <div className="overview-container">
      <div className="section-header-container">
        <h1 className="section-name">Overview</h1>
        <Link to="/dashboard">
          <div className="back-button">
            <h1 className="back-button">Back</h1>
          </div>
        </Link>
      </div>
      <div className="statistic-container">
        <div className="statistic-box">
          <h2 className="label">Total Invested</h2>
          <h3 className="statistic-label">${totalInvested}</h3>
        </div>
        <div className="statistic-box">
          <h2 className="label">Profit/Loss</h2>
          <h3 className="statistic-label">
            {growth < 0 ? growth : "+" + growth}%
          </h3>
        </div>
        <div className="statistic-box">
          <h2 className="label">Monthly Income</h2>
          <h3 className="statistic-label">${monthlyIncome}</h3>
        </div>
        <div className="statistic-box">
          <h2 className="label">Annual Income</h2>
          <h3 className="statistic-label">${annualIncome}</h3>
        </div>
      </div>
      <div className="graph">
        <Graph
          timeStamps={timeStamps}
          graphData={graphData}
          setRange={setRange}
          setIntervals={setIntervals}
        />
      </div>
      <div className="padding"></div>
    </div>
  );
};

export default Overview;
