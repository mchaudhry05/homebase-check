import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery, useEntity } from "homebase-react";
import "./overviewStyle.css";
import PortfolioGrowthGraph from "../PortfolioGrowthGraph/PortfolioGrowthGraph";

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
  const [tickerSymbols, setTickerSymbols] = useState([]);
  const [shares, setShares] = useState([]);

  /**
   * Using Homebase's useEntity API call to get access to all
   * relationships associated with the currentUser identity
   */
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
    const tickerSymbols = [];
    const buyPricePerStock = [];
    const sharesPerStock = [];

    allStocks.map((stock) => {
      tickerSymbols.push(stock.get("tickerSymbol"));
      sharesPerStock.push(stock.get("shares"));
      buyPricePerStock.push(stock.get("buyPrice"));
    });

    setShares(sharesPerStock);

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
   * the percentage growth of a user's portfolio as well as the total amount
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
      updateAnnualIncome(stock.dividendYield, shares[index]);
      updateMonthlyIncome(
        stock.dividendDate,
        stock.diviendsPerShare,
        shares[index]
      );
    });

    const growthPercentage = (marketValue - costBasis) / costBasis;

    setGrowth(Math.round(growthPercentage * 100, 2));
    setTotalInvested(Math.round(marketValue), 2);
  };

  /**
   * updateAnnualIncome adds the income from one stock to the overall annualIncome
   * the user will make from their investments
   * @param {Array} trailingAnnualDividendRate the diviend rate for said stock
   * @param {Array} shares an array with the number of shares per stock
   */
  let partialAnnualIncome = 0;
  const updateAnnualIncome = (trailingAnnualDividendRate, shares) => {
    if (trailingAnnualDividendRate) {
      partialAnnualIncome += parseFloat(trailingAnnualDividendRate) * shares;
    } else {
    }

    setAnnualIncome(partialAnnualIncome.toFixed(2));
  };

  /**
   *
   * @param {String} diviendDate is the date of when the user will get their
   * diviend
   * @param {String} diviendValue is the amount of the diviend per stock
   * @param {Array} shares is an array wit the number of shares per stock
   */
  let partialMonthlyIncome = 0;
  const updateMonthlyIncome = (diviendDate, diviendsPerShare, shares) => {
    var date = new Date();
    const month = date.getMonth();
    console.log(month);
    const dividendDateFormatted = new Date(1000 * diviendDate);

    if (diviendDate) {
      //const diviendMonth = parseInt(diviendDate.fmt.substring(6, 7));
      if (dividendDateFormatted.getMonth() && month === diviendsPerShare) {
        partialMonthlyIncome += diviendsPerShare * shares;
      }
    }
    setMonthlyIncome(partialMonthlyIncome.toFixed(2));
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
      {
        allStocks.length > 0 ? 
        <div className="graph">
          <PortfolioGrowthGraph tickerSymbols={tickerSymbols} shares={shares} />
       </div>
       :
       <div className="no-stocks-container">
         <img className="no-graph-img" src="./Group 33.svg"></img>
       </div>
      }   
      <div className="padding"></div>
    </div>
  );
};

export default Overview;
