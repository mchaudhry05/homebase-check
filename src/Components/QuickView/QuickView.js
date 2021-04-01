import "./quickViewStyle.css";
import axios from "axios";
import { useQuery, useEntity } from "homebase-react";
import { useEffect, useState } from "react";
import AddModal from "../AddModal/AddModal";
import { Link } from "react-router-dom";
import DiversificationGraph from "../DiversificationGraph/DiversificationGraph";
import SkeletonQuickView from "../SkeletonComponents/SkeletonQuickView";

/**
 * QuickView is a component that represents the three
 * different pieces (total invested, diversity, the ability
 * to add a stock) of information you see on the Dashboard
 */
const QuickView = ({ graphData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [totalInvested, setTotalInvested] = useState(0.0);
  const [stocks, setStocks] = useState([]);
  const [shares, setShares] = useState([]);
  const [display, setDisplay] = useState(true);

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
   * useEffect here is being used to make an API call
   * that will return the current price of each stock
   * in the user's portfolio
   */
  useEffect(() => {
    setStocks(allStocks);

    const tickerSymbols = [];
    const sharesPerStock = [];

    allStocks.map((stock) => {
      tickerSymbols.push(stock.get("tickerSymbol"));
      sharesPerStock.push(stock.get("shares"));
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
          parseResults(response.data.quoteResponse.result, sharesPerStock);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [allStocks, totalInvested]);

  const changeModalState = () => {
    setShowAddModal(!showAddModal);
  };

  /**
   * parseResults adds up the value of the user's
   * portfolio to give the total amount they have invested
   * @param {Array} stockQuotes is an array with the current
   * price of the user's stocks
   */
  const parseResults = (stockQuotes, shares) => {
    let total = 0.0;

    stockQuotes.map((stock, index) => {
      console.log(shares[index]);
      total += parseFloat(stock.ask) * parseFloat(shares[index]);
    });

    setTotalInvested(Math.round(total), 2);
    setDisplay(false);
  };

  setTimeout(() => {
    setDisplay(false);
  }, 3000);

  return (
    <>
      {display && <SkeletonQuickView />}
      {!display && (
        <div className="quick-view-container">
          <Link to="/overview">
            <div className="quick-view-holder">
              <h1 className="total-invested-label">${totalInvested}</h1>
              <div className="quick-view-img-label quick-view-margin-down">
                <img className="label-img" src="./images/money.svg"></img>
                <h2 className="quick-view-container-labels">Total Invested</h2>
              </div>
            </div>
          </Link>
          <Link to="/diversification">
            <div className="quick-view-holder">
              {graphData ? (
                <div className="quickview-diversification quick-view-margin-top">
                  <DiversificationGraph
                    graphData={graphData}
                    width={"100"}
                    height={"100"}
                    color={"white"}
                    showLegend={false}
                    showLabel={false}
                  />
                </div>
              ) : (
                <div className="quickview-diversification">
                  <div className="no-mini-graph"></div>
                </div>
              )}
              <div className="quick-view-img-label quick-view-margin-left quick-view-margin-small-down">
                <img className="label-img" src="./images/coin.svg"></img>
                <h2 className="quick-view-container-labels">Diversification</h2>
              </div>
            </div>
          </Link>
          <Link>
            <div className="quick-view-holder">
              <div className="add-button" onClick={changeModalState}>
                <h1 className="add-icon" onClick={changeModalState}>
                  +
                </h1>
              </div>

              <div className="quick-view-img-label quick-view-margin-small-down quick-view-margin-left">
                <img
                  className="label-img-smaller"
                  src="./images/update.svg"
                ></img>
                <h2 className="quick-view-container-labels">Update</h2>
              </div>
            </div>
          </Link>
          {showAddModal ? <AddModal closeModal={changeModalState} /> : null}
        </div>
      )}
    </>
  );
};

export default QuickView;
