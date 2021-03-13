import "./quickViewStyle.css";
import axios from "axios";
import { useQuery, useEntity } from "homebase-react";
import { useEffect, useState } from "react";
import AddModal from "../AddModal/AddModal";
import { Link } from "react-router-dom";

/**
 * QuickView is a component that represents the three
 * different pieces (total invested, diversity, the ability
 * to add a stock) of information you see on the Dashboard
 */
const QuickView = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [totalInvested, setTotalInvested] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [shares, setShares] = useState([]);

  const changeModalState = () => {
    setShowAddModal(!showAddModal);
  };

  const [currentUser] = useEntity({ identity: "currentUser" });

  const [allStocks] = useQuery({
    $find: "stock",
    $where: { stock: { user: currentUser.get("id") } },
  });

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
          console.log(response.data.quoteResponse.result);
          parseResults(response.data.quoteResponse.result);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [allStocks, totalInvested]);

  const parseResults = (stockQuotes) => {
    let total = 0;

    stockQuotes.map((stock, index) => {
      total += stock.ask * shares[index];
    });

    setTotalInvested(Math.round(total), 2);
  };

  console.log(totalInvested);

  return (
    <div className="quick-view-container">
      <Link to="/overview">
        <div className="quick-view-holder">
          <h1 className="label">Total Invested</h1>
          <h1 className="total-invested-label">${totalInvested}</h1>
        </div>
      </Link>
      <div className="quick-view-holder"></div>
      <div className="quick-view-holder add">
        <div className="label-container">
          <h1 className="label">Update</h1>
        </div>

        <div className="add-button" onClick={changeModalState}>
          <h1 className="add-icon" onClick={changeModalState}>
            +
          </h1>
        </div>
      </div>
      {showAddModal ? <AddModal closeModal={changeModalState} /> : null}
    </div>
  );
};

export default QuickView;
