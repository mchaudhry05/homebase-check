import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery, useEntity } from "homebase-react";
import DiversificationGraph from "../DiversificationGraph/DiversificationGraph";
import "./diversificationStyle.css";
import Stock from "../Stock/Stock";

const Diversification = () => {
  const [previousSector, setPreviousSector] = useState("All");
  const [sectorSelected, setSectorSelected] = useState("All");
  const [graphData, setGraphData] = useState();
  const [stocksFound, setStocks] = useState([]);
  const [listOfStockPrices, setListOfStockPrices] = useState([]);
  const [stockPrices, setStockPrices] = useState([]);

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
   * useEffect here is being used to calculate the different
   * sectors thats exist and the amount of stocks the user
   * owns in those sectors
   */
  useEffect(() => {
    let diversification = new Map();

    if (allStocks.length !== 0) {
      allStocks.map((stock) => {
        if (diversification.has(stock.get("sector"))) {
          const oldCount = diversification.get(stock.get("sector"));
          const newCount = oldCount + stock.get("shares");
          diversification.set(stock.get("sector"), newCount);
        } else {
          const count = stock.get("shares");
          diversification.set(stock.get("sector"), count);
        }
      });

      setGraphData(diversification);
    }
  }, [allStocks]);

  /**
   * useEffect is used here to set the the state of the component
   * with all of the stocks that were found
   */
  useEffect(() => {
    setStocks(allStocks);
  }, [stocksFound.length, allStocks.length]);

  /**
   * useEffect is used here to grab the ticker symbol of all of
   * the stocks that the user owns
   */
  useEffect(() => {
    let stockPrices = []; //change name of this
    stocksFound.map((stock) => stockPrices.push(stock.get("tickerSymbol")));
    setListOfStockPrices(stockPrices);
  }, [stocksFound.length, allStocks.length]);

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

  if (localStorage.getItem("token") !== "passed!") {
    return <Redirect to="/"></Redirect>;
  }

  return (
    <div className="diversification-container">
      <div className="section-header-container">
        <h1 className="section-name">Diversification</h1>
        <Link to="/dashboard">
          <div className="back-button">
            <img className="back-img" src="./images/back.svg"></img>
          </div>
        </Link>
      </div>
      {allStocks.length > 0 ? (
        <>
          <div className="diversificiation-graph-container">
            <div>
              <DiversificationGraph
                graphData={graphData}
                width={"380"}
                height={"380"}
                color={"#f9fafe"}
                showLegend={true}
                sectorSelected={sectorSelected}
                setSectorSelected={setSectorSelected}
                previousSector={previousSector}
                setPreviousSector={setPreviousSector}
                showLabel={true}
              />
            </div>
          </div>
          <div className="sector-stocks-container">
            <h1>{sectorSelected + " Stocks"}</h1>

            {allStocks.length !== 0 ? (
              <>
                {sectorSelected === previousSector ? (
                  <>
                    {allStocks.map((stock, index) => (
                      <Stock
                        key={stock.get("id")}
                        name={stock.get("name")}
                        tickerSymbol={stock.get("tickerSymbol")}
                        website={stock.get("website")}
                        currentPrice={stockPrices[index]}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    {allStocks
                      .filter((stock) => stock.get("sector") === sectorSelected)
                      .map((filteredStock) => (
                        <Stock
                          key={filteredStock.get("id")}
                          name={filteredStock.get("name")}
                          tickerSymbol={filteredStock.get("tickerSymbol")}
                          website={filteredStock.get("website")}
                          currentPrice={
                            stockPrices[allStocks.indexOf(filteredStock)]
                          }
                        />
                      ))}
                  </>
                )}
              </>
            ) : (
              <h1>Loading</h1>
            )}
          </div>
        </>
      ) : (
        <div className="no-stocks-container">
          <img className="no-graph-img" src="./images/no-stocks.svg"></img>
        </div>
      )}
      <div className="padding"></div>
    </div>
  );
};

export default Diversification;
