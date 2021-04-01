import "./editFormStyle.css";
import { useState } from "react";
import { useTransact } from "homebase-react";
/**
 *
 * EditForm is a component that represents the edit form
 * allowing the user to update the number of stocks they hold
 * for that stock and the avg cost of each stock.
 * @param {Entity} stock is the stock entity which the user wants
 * to update
 * @param {Function} setShowEditFrom is the function that hides and
 * displays te EditForm
 *
 */
const EditForm = ({ stock, setShowEditFrom }) => {
  const [message, setMessage] = useState(
    "Please Enter the Update Stock Information!"
  );
  const [shares, setShares] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);

  const updateShares = (e) => {
    setShares(e.target.value);
  };

  const updateBuyPrice = (e) => {
    setBuyPrice(e.target.value);
  };

  /**
   * Using Homebase's useTransact API call to update and
   * delete a stock Entity
   */
  const [transact] = useTransact();

  /**
   *
   * deleteStock deletes the stock from the user's
   * portfolio
   * @param {Event} e is the event that triggered the
   * function
   *
   */
  const deleteStock = (e) => {
    e.preventDefault();
    setMessage("DELETING ...");
    setTimeout(() => {
      setMessage("UPDATED!");
    }, 2000);
    transact([["retractEntity", stock[0].get("id")]]);
    setTimeout(() => {
      window.location = "/dashboard";
    }, 3000);
  };

  /**
   *
   * updatePortfolio updates the holding of said stock
   * in the user's portfolio
   * @param {Event} e is the event that triggered the
   * function
   *
   */
  const updatePortfolio = (e) => {
    e.preventDefault();
    setMessage("UPDATING ...");
    setTimeout(() => {
      setMessage("UPDATED!");
    }, 2000);

    transact([
      {
        stock: {
          id: stock[0].get("id"),
          shares: parseInt(shares),
          buyPrice: parseFloat(buyPrice),
        },
      },
    ]);
    setTimeout(() => {
      setShowEditFrom(false);
    }, 3000);
  };

  return (
    <div className="edit-stock-container">
      <div className="content-container">
        <h1 className="instruction-message">{message}</h1>
        <div className="inputs-container">
          <form className="edit-stock-form" onSubmit={updatePortfolio}>
            <label>Total Shares Owned</label>
            <br></br>
            <input
              className="#-of-shares"
              type="number"
              name="#-of-shares"
              id="stock-info"
              onChange={updateShares}
            ></input>
            <br></br>
            <label>New Buy Price Per Stock</label>
            <br></br>
            <input
              className="#-of-shares"
              type="number"
              name="#-of-shares"
              id="stock-info"
              step="0.01"
              onChange={updateBuyPrice}
            ></input>
            <br></br>
            <button onClick={deleteStock} className="delete-stock">
              DELETE
            </button>
            <input
              className="update-stock"
              style={{ cursor: "pointer" }}
              type="submit"
              onSubmit={updatePortfolio}
            ></input>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
