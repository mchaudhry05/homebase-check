import "./stockStyle.css";

/**
 * Stock is a component that represents the information the user
 * sees about the stock on the Dashboard
 * @param {String} tickerSymbol is the ticker symbol of the stock
 * @param {String} website is the URL of the website
 * @param {String} name is the name of the company
 * @param {Array} currentPrice is an array that represents the open
 * price of the stock and the current price
 */
const Stock = ({ tickerSymbol, website, name, currentPrice }) => {
  return (
    <div className="stock">
      {currentPrice && currentPrice.length == 2 ? (
        <>
          <div className="logo-img-container">
            {website ? <img
              className="logo-img"
              // the image of the company is taken from http://logo.clearbit.com
              src={`http://logo.clearbit.com/${website}`}
            ></img> : 
            <div className="ticker-container">
              <h4 className="ticker-label">{tickerSymbol}</h4>
            </div>
            }
          </div>
          <div className="company-name-container">
            <h1 className="company-name">{name}</h1>
          </div>
          <div className="current-price-container">
            <h2
              style={
                currentPrice[1] > currentPrice[0] //decide the background color based on if
                  ? { backgroundColor: "#FF5964" } //the current Price of the stock is higher or
                  : { backgroundColor: "#6BF178" } //lower than when it opened
              }
              className="current-price"
            >
              ${currentPrice[0]}
            </h2>
          </div>
        </>
      ) : (
        <h2> Loading ...</h2>
      )}
    </div>
  );
};

export default Stock;
