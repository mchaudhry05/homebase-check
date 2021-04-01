import {
  useClient,
  useTransact,
  useQuery,
  useEntity,
  Transaction,
  Entity,
} from "homebase-react";
import { useEffect, useState } from "react";
import QuickView from "../QuickView/QuickView";
import SkeletonStockContainer from "../SkeletonComponents/SkeletonStockContainer";
import StockContainer from "../StockContainer/StockContainer";
import "./dashboardStyle.css";

/**
 * Dashboard is a component that reneders all of the components
 * that will be part of the dashboard and is accessible upon sign-in
 */
const Dashboard = ({ setDiversificationGraphData }) => {
  const [currentUser] = useEntity({ identity: "currentUser" });
  const [display, setDisplay] = useState(true);
  const [graphData, setGraphData] = useState();
  const [allStocks] = useQuery({
    $find: "stock",
    $where: { stock: { user: currentUser.get("id") } },
  });

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
      setDiversificationGraphData(diversification);
    }
  }, [allStocks]);

  setTimeout(() => {
    setDisplay(false);
  }, 1000);

  return (
    <div className="dashboard-container">
      <h1 className="name-label">Hello, {currentUser.get("name")}!</h1>

      <QuickView graphData={graphData} />
      {display && <SkeletonStockContainer />}
      {!display > 0 && (
        <>
          {allStocks.length > 0 ? (
            <StockContainer sectorSelected={"All"} previousSector={"All"} />
          ) : (
            <div className="no-stocks-container">
              <img
                className="no-stocks-img"
                src="./images/no-stocks-2.svg"
              ></img>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
