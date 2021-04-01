import "./stockContainerStyle.css";
import { useState, useEffect } from "react";
import { useQuery, useEntity } from "homebase-react";
import axios from "axios";
import Stock from "../Stock/Stock";
import { Link } from "react-router-dom";
/**
 * Stock Container is a component that houses
 * some of the API calls made to gather more
 * information about the stocks
 */
const StockContainer = () => {
  const [stocksFound, setStocks] = useState([]);
  const [listOfStockPrices, setListOfStockPrices] = useState([]);
  const [stockPrices, setStockPrices] = useState([]);

  const [currentUser] = useEntity({ identity: "currentUser" });
  const [stocks] = useQuery({
    $find: "stock",
    $where: { stock: { user: currentUser.get("id") } },
  });

  /**
   * useEffect is used here to set the the state of the component
   * with all of the stocks that were found
   */
  useEffect(() => {
    setStocks(stocks);
  }, [stocksFound.length, stocks.length]);

  /**
   * useEffect is used here to grab the ticker symbol of all of
   * the stocks that the user owns
   */
  useEffect(() => {
    let stockPrices = [];
    stocksFound.map((stock) => stockPrices.push(stock.get("tickerSymbol")));
    setListOfStockPrices(stockPrices);
  }, [stocksFound.length, stocks.length]);

  /**
   * useEffect is used here to make an API call to grab the user's current price
   * and the price at which the stock opened on
   */
  useEffect(() => {
    if (listOfStockPrices.length !== 0) {
      const options = {
        method: "GET",
        url:
          "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
        params: { region: "US", symbols: listOfStockPrices.join(",") },
        headers: {
          "x-rapidapi-key":
            "453fc3a354msh27d132f07bd85d1p19b49djsnbdbf84ff7b1a",
          "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          parseResults(response.data.quoteResponse.result);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [listOfStockPrices]);

  /**
   * parseResults takes the information from the API call
   * and takes out the ask price and the preMarketPrice
   * @param {Integer} stockQuotes
   */
  const parseResults = (stockQuotes) => {
    let stockPrices = [];
    stockQuotes.map((stock) => {
      let stockPriceChanges = [];
      stockPriceChanges.push(stock.ask);
      stockPriceChanges.push(stock.regularMarketPreviousClose);
      stockPrices.push(stockPriceChanges);
      stockPriceChanges = [];
    });
    setStockPrices(stockPrices);
  };

  return (
    <div className="stock-container">
      <h1 className="your-investments-label">Your Investments</h1>
      {stocksFound.length !== 0 && stockPrices.length !== 0 ? (
        <>
          {stocksFound.map((stock, index) => (
            <Link to={"/stockoverview/" + stock.get("tickerSymbol")}>
              <Stock
                key={stock.get("id")}
                name={stock.get("name")}
                tickerSymbol={stock.get("tickerSymbol")}
                website={stock.get("website")}
                currentPrice={stockPrices[index]}
              />
            </Link>
          ))}
        </>
      ) : (
        <>
          <div className="stock-skeleton animate"></div>
          <div className="stock-skeleton animate"></div>
          <div className="stock-skeleton animate"></div>
        </>
      )}
      <div className="padding"></div>
    </div>
  );
};

export default StockContainer;
