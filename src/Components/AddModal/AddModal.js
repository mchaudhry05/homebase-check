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
  const [numberOfShares, setNumberOfShares] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [buyDate, setBuyDate] = useState("");
  const [newStock, setNewStock] = useState(true);
  const [stockURL, setStockURL] = useState("");
  const [sector, setSector] = useState("");
  const [showLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [change, setChange] = useState(false);
  const [data, setData] = useState();

  /**
   * This function updates the state by reading
   * the user inputs for the stock information
   * @param {Event} e is the event that triggered
   * the function call
   */
  const updateState = (e) => {
    const { value, name } = e.target;
    setChange(!change);
    if (name !== "") {
      if (name === "ticker-symbol") {
        setTickerSymbol(value.toUpperCase().trim());
      } else if (name === "#-of-shares") {
        setNumberOfShares(value.toUpperCase().trim());
      } else if (name === "buy-price") {
        setBuyPrice(value.toUpperCase().trim());
      } else if (name === "buy-date") {
        setBuyDate(value.toUpperCase().trim());
      } else if (name === "new-stock") {
        setNewStock(!newStock);
        console.log(newStock);
      }
    }
  };

  /**
   * useEffect is being used to make an API call to the
   * Yahoo Finance API based on the Ticker Symbol
   * provided by the user
   */
  useEffect(() => {
    //console.log(document.getElementsByClassName("ticker-symbol")[0].value);
    setData();
    console.log(tickerSymbol)
    if (tickerSymbol !== "") {
      const options = {
        method: "GET",
        url:
          "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile",
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
          let data = response.data;
          setData(data);
        })
        .catch(function (error) {});
    }
  }, [tickerSymbol, setTickerSymbol]);

  /**
   * addStocks is the function that makes sure
   * to grab the information returned from the
   * API and calls updatePortfolio to have
   * all the information added to the portfolio
   * @param {Event} e is the event that triggered
   * the function call
   */
  const addStocks = (e) => {
    e.preventDefault();
    let tickerSymbolValue = document.getElementsByClassName("ticker-symbol")[0].value.trim().toUpperCase();
    setTickerSymbol(tickerSymbolValue)

    setLoading(true);
    if (data) {
      console.log(data);
      setMessage("The stock was added!");
      setStockURL(data.assetProfile.website);
      setSector(data.assetProfile.sector);
     
      updatePortfolio(
        data.quoteType.shortName,
        data.assetProfile.website,
        data.assetProfile.sector
      );
      setLoading(false);
    } else {
      setMessage("Please check the ticker symbol you provided!");
      setLoading(false);
    }
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const [currentUser] = useEntity({ identity: "currentUser" });

  const [stock] = useEntity({ stock: { tickerSymbol: tickerSymbol } });

  const [transact] = useTransact();

  /**
   * This function uses the transact API call from Homebase to communicate with
   * the Firebase backend and store all of the information inside of the database
   * @param {String} companyName is the name of the company
   * @param {String} companyWebsite is the URL of the company's website
   * @param {String} companySector is the sector within which the company is in
   */
  const updatePortfolio = (companyName, companyWebsite, companySector) => {
    console.log("here")
    if (!newStock) {
      transact([
        {
          stock: {
            id: stock.get("id"),
            shares:
              parseFloat(stock.get("shares")) + parseFloat(numberOfShares),
            buyPrice:
              (parseFloat(stock.get("buyPrice")) *
                parseFloat(stock.get("shares")) +
                parseFloat(buyPrice) * parseFloat(numberOfShares)) /
              (parseFloat(stock.get("shares")) + parseFloat(numberOfShares)),
          },
        },
      ]);
    } else {
      transact([
        {
          stock: {
            user: currentUser.get("id"),
            tickerSymbol: tickerSymbol,
            shares: parseFloat(numberOfShares),
            buyPrice: parseFloat(buyPrice),
            buyDate: buyDate,
            website: companyWebsite ? companyWebsite : "",
            sector: companySector ? companySector : "",
            name: companyName ? companyName : "",
          },
        },
      ]);
    }
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
        <form id="add-form" onSubmit={e =>{e.preventDefault()}}>
          <div className="toggle-holder">
            <h2 className="label">New Stock</h2>
            <label className="switch">
              <input
                type="checkbox"
                name="new-stock"
                onClick={updateState}
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
                  onChange={updateState}
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
                  onChange={updateState}
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
                  onChange={updateState}
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
                  onChange={updateState}
                  required
                ></input>
              </div>
            </div>
          </div>
          <input
              className="add-stock"
              style={
                showLoading ? { cursor: "not-allowed" } : { cursor: "pointer" }
              }
              type="submit"
              
              onClick={addStocks}
            >
              {/* {showLoading ? "LOADING" : "UPDATE"} */}
            </input>
          </form>
      </div>
    </div>
  );
};

export default AddModal;
