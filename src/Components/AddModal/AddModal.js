import "./addModalStyle.css";
import { useQuery, useTransact, useEntity } from "homebase-react";
import { useEffect, useState } from "react";
import axios from "axios";

/**
 * AddModal is a component that represents a modal
 * that allows you to input information about a new
 * stock you have added to your portfolio
 * @param {Boolean} closeModal this is a boolean
 * set to allow the user to open and close the
 * AddModal
 */
const AddModal = ({ closeModal }) => {
  const [tickerSymbol, setTickerSymbol] = useState("");
  const [shares, setShares] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [buyDate, setBuyDate] = useState("");
  const [newStock, setNewStock] = useState(true);
  const [message, setMessage] = useState("");
  const [data, setData] = useState({});

  const updateTickerSymbol = (e) => {
    setTickerSymbol(e.target.value);
  };

  const updateShares = (e) => {
    setShares(e.target.value);
  };

  const updateBuyPrice = (e) => {
    setBuyPrice(e.target.value);
  };

  const updateBuyDate = (e) => {
    setBuyDate(e.target.value);
  };

  const updateNewStock = (e) => {
    setNewStock(!newStock);
  };

  const fetchData = () => {
    if (tickerSymbol !== "") {
      const options = {
        method: "GET",
        url:
          "https://1apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile",
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
          console.log(response.data);
          setData(response.data);

          updatePortfolio(
            response.data.quoteType.shortName,
            response.data.assetProfile.website,
            response.data.assetProfile.sector
          );
        })
        .catch(function (error) {
          setMessage("Invalid Ticker Symbol!");
          setTimeout(() => {
            setMessage("");
          }, 3000);
          console.log(error);
        });
    }
  };

  const addStock = (e) => {
    e.preventDefault();
    setMessage("Adding ...");
    fetchData();
  };

  const [currentUser] = useEntity({ identity: "currentUser" });
  const [stocks] = useQuery({
    $find: "stock",
    $where: { stock: { user: currentUser.get("id") } },
  });

  //console.log(stocks)
  //const [stock] = useEntity({ stock: { tickerSymbol: tickerSymbol } });
  //console.log(stock.get("id"));
  //console.log(newStock)

  const [transact] = useTransact();

  const updatePortfolio = (companyName, companyWebsite, companySector) => {
    let stock;
    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].get("tickerSymbol") === tickerSymbol) {
        stock = stocks[i];
        break;
      }
    }
    if (!newStock) {
      transact([
        {
          stock: {
            id: stock.get("id"),
            shares: parseFloat(stock.get("shares")) + parseFloat(shares),
            buyPrice:
              (parseFloat(stock.get("buyPrice")) *
                parseFloat(stock.get("shares")) +
                parseFloat(buyPrice) * parseFloat(shares)) /
              (parseFloat(stock.get("shares")) + parseFloat(shares)),
          },
        },
      ]);
    } else {
      transact([
        {
          stock: {
            user: currentUser.get("id"),
            tickerSymbol: tickerSymbol,
            shares: parseFloat(shares),
            buyPrice: parseFloat(buyPrice),
            buyDate: buyDate,
            website: companyWebsite ? companyWebsite : "",
            sector: companySector ? companySector : "",
            name: companyName ? companyName : "",
          },
        },
      ]);
    }

    setMessage("Succesfully Added!");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="add-modal-container">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          CLOSE
        </span>
        <h1 className="label margin-down">Input Stock Information</h1>
        <div className="message">
          <p className="label">{message}</p>
        </div>
        <form id="add-form" onSubmit={addStock}>
          <div className="toggle-holder">
            <h2 className="label">New Stock</h2>
            <label className="switch">
              <input
                type="checkbox"
                name="new-stock"
                onClick={updateNewStock}
              ></input>
              <span className="slider round"></span>
            </label>
            <h2 className="label">Update Stock</h2>
          </div>
          <div className="label">
            <div className="form-row">
              <div className="input-container-right">
                <label className="label">Ticker Symbol</label>
                <br className="label"></br>
                <input
                  className="ticker-symbol"
                  type="text"
                  name="ticker-symbol"
                  id="stock-info"
                  onChange={updateTickerSymbol}
                  required
                ></input>
              </div>
              <div className="input-container-left">
                <label className="label"># of Shares</label>
                <br></br>
                <input
                  className="#-of-shares"
                  type="number"
                  name="#-of-shares"
                  id="stock-info-3"
                  onChange={updateShares}
                  required
                ></input>
              </div>
            </div>
            <div className="form-row">
              <div className="input-container-right">
                <label className="label">Buy Price (Per Share)</label>
                <br></br>
                <input
                  className="buy-price"
                  type="number"
                  name="buy-price"
                  id="stock-info-2"
                  onChange={updateBuyPrice}
                  step="0.01"
                  required
                ></input>
              </div>
              <div className="input-container-left">
                <label className="label">Buy Date</label>
                <br></br>
                <input
                  className="buy-date"
                  type="date"
                  name="buy-date"
                  onChange={updateBuyDate}
                  required
                ></input>
              </div>
            </div>
          </div>
          <input
            className="add-stock"
            style={
              { cursor: "pointer" }
              // showLoading ? { cursor: "not-allowed" } : { cursor: "pointer" }
            }
            type="submit"
            onSubmit={addStock}
          >
            {/* {showLoading ? "LOADING" : "UPDATE"} */}
          </input>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
