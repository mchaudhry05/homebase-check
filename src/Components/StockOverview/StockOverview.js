import "./stockOverviewStyle.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useEntity, useQuery } from "homebase-react";
import { Redirect } from "react-router-dom";
import PortfolioGrowthGraph from "../PortfolioGrowthGraph/PortfolioGrowthGraph";
import EditForm from "../EditForm/EditForm";
import SkeletonStockOverview from "../SkeletonComponents/SkeletonStockOverview";

/**
 *
 * StockOverview is a component which represents the the stock
 * overview page, where the user can see certain information about
 * the stock and see stock's growth.
 *
 */
const StockOverview = () => {
  const [stock, setStock] = useState([]);
  const [marketPrice, setMarketPrice] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [quarterlyIncome, setQuarterlyIncome] = useState(0);
  const [dividendYield, setDividendYield] = useState(0);
  const [showEditForm, setShowEditFrom] = useState(false);
  const [display, setDisplay] = useState(true);
  const location = useLocation();
  const tickerSymbol = location.pathname.split("/")[2];

  /**
   * Using Homebase's useEntity API call to get access to all
   * relationships associated with the currentUser identity
   */
  const [currentUser] = useEntity({ identity: "currentUser" });

  /**
   * Using Homebase's useQuery API call to get all the stocks
   * the user owns
   */
  const [findStock] = useQuery({
    $find: "stock",
    $where: {
      stock: { user: currentUser.get("id"), tickerSymbol: tickerSymbol },
    },
  });

  /**
   *
   * useEffect here is being used to make an API call to grab
   * all of the information needed for this page
   */
  useEffect(() => {
    if (findStock.length > 0) {
      setStock(findStock);
      const options = {
        method: "GET",
        url:
          "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
        params: { region: "US", symbols: tickerSymbol },
        headers: {
          "x-rapidapi-key":
            "453fc3a354msh27d132f07bd85d1p19b49djsnbdbf84ff7b1a",
          "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          parseResults(response.data.quoteResponse.result, findStock);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [findStock]);

  /**
   *
   * parseResults take the result from the API call to calculate
   * the percentage growth of a user's portfolio as well as the
   * total amount they have invested (market value of portfolio),
   * annual and quartery incomes and sets all the other stats needed
   * for this component to function
   * @param {JSON} data is the data response form the API
   * @param {Entity} stock is the stock Entity
   *
   */
  const parseResults = (data, stock) => {
    setMarketPrice(data[0].ask);
    setGrowth(
      (
        stock[0].get("shares") *
        (data[0].ask - stock[0].get("buyPrice"))
      ).toFixed(2)
    );
    if (data[0].dividendYield) {
      setAnnualIncome(
        (
          (data[0].dividendYield / 100) *
          stock[0].get("shares") *
          data[0].ask
        ).toFixed(2)
      );
      setDividendYield(data[0].dividendYield);
      setQuarterlyIncome(
        (
          ((data[0].dividendYield / 100) *
            stock[0].get("shares") *
            data[0].ask) /
          4
        ).toFixed(2)
      );
      setDisplay(false);
    }
  };

  /**
   * showEdit changes the state of the showEdit form hiding and
   * displaying it
   * @param {Event} e is the event that triggered the call
   */
  const showForm = (e) => {
    setShowEditFrom(!showEditForm);
  };

  setTimeout(() => {
    setDisplay(false);
  }, 3000);

  if (localStorage.getItem("token") !== "passed!") {
    return <Redirect to="/"></Redirect>;
  }

  return (
    <>
      {display && <SkeletonStockOverview />}
      {!display && (
        <div className="stock-overview-container">
          {stock.length > 0 ? (
            <>
              <div className="section-header-container">
                <div className="logo-img-container margin-right">
                  {stock[0].get("website") ? (
                    <img
                      className="logo-img"
                      // the image of the company is taken from http://logo.clearbit.com
                      src={`http://logo.clearbit.com/${stock[0].get(
                        "website"
                      )}`}
                    ></img>
                  ) : (
                    <div className="ticker-container">
                      <h4 className="ticker-label">{tickerSymbol}</h4>
                    </div>
                  )}
                </div>
                <h1 className="section-name center">
                  {stock[0].get("name")}
                  <button className="edit-button" onClick={showForm}>
                    EDIT
                  </button>
                </h1>

                <Link to="/dashboard">
                  <div className="back-button">
                    <img className="back-img" src=".././images/back.svg"></img>
                  </div>
                </Link>
              </div>

              {showEditForm && (
                <EditForm setShowEditFrom={setShowEditFrom} stock={stock} />
              )}
              <div className="information-container">
                <div className="information-box">
                  <h2 className="label">Expected Annual Income</h2>
                  <h3 className="statistic-label">${annualIncome}</h3>
                </div>
                <div className="information-box">
                  <h2 className="label">Expected Quarterly Income</h2>
                  <h3 className="statistic-label">${quarterlyIncome}</h3>
                </div>
                <div className="information-box">
                  <h2 className="label">Diviend Yield</h2>
                  <h3 className="statistic-label">{dividendYield}%</h3>
                </div>
                <div className="information-box">
                  <h2 className="label">Shares</h2>
                  <h3 className="statistic-label">{stock[0].get("shares")}</h3>
                </div>
                <div className="information-box">
                  <h2 className="label">Cost Average</h2>
                  <h3 className="statistic-label">
                    ${stock[0].get("buyPrice")}
                  </h3>
                </div>
                <div className="information-box">
                  <h2 className="label">Market Price</h2>
                  <h3 className="statistic-label">${marketPrice}</h3>
                </div>
                <div className="information-box">
                  <h2 className="label">Cost Basis</h2>
                  <h3 className="statistic-label">
                    ${stock[0].get("shares") * stock[0].get("buyPrice")}
                  </h3>
                </div>
                <div className="information-box">
                  <h2 className="label">Market Value</h2>
                  <h3 className="statistic-label">
                    ${(marketPrice * stock[0].get("shares")).toFixed(2)}
                  </h3>
                </div>
                <div className="information-box">
                  <h2 className="label">Growth</h2>
                  <h3 className="statistic-label">${growth}</h3>
                </div>
              </div>
              <div className="graph">
                <PortfolioGrowthGraph
                  tickerSymbols={[tickerSymbol]}
                  shares={[stock[0].get("shares")]}
                />
              </div>
            </>
          ) : (
            <h1>LOADING</h1>
          )}
          <div className="padding"></div>
        </div>
      )}
    </>
  );
};

export default StockOverview;
