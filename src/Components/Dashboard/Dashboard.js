import {
  useClient,
  useTransact,
  useQuery,
  useEntity,
  Transaction,
  Entity,
} from "homebase-react";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import QuickView from "../QuickView/QuickView";
import StockContainer from "../StockContainer/StockContainer";
import "./dashboardStyle.css";

/**
 * Dashboard is a component that reneders all of the components
 * that will be part of the dashboard and is accessible upon sign-in
 */
const Dashboard = ({ setDiversificationGraphData }) => {
  const [currentUser] = useEntity({ identity: "currentUser" });
  const [graphData, setGraphData] = useState();
  const [allStocks] = useQuery({
    $find: "stock",
    $where: { stock: { user: currentUser.get("id") } },
  });

  useEffect(()=>{
    let diversification = new Map();
   
    if (allStocks.length !== 0){
        allStocks.map(stock=>{
            if (diversification.has(stock.get("sector"))){
                const oldCount = diversification.get(stock.get("sector")); 
                const newCount = oldCount + stock.get("shares"); 
                diversification.set(stock.get("sector"), newCount); 
            }else{
                const count = stock.get("shares"); 
                diversification.set(stock.get("sector"), count); 
            }
        });
        
        setGraphData(diversification);
        setDiversificationGraphData(diversification);
    }
  }, [allStocks])

  return (
    <div className="dashboard-container">
      <h1 className="name-label">Hello, {currentUser.get("name").substring(0, currentUser.get("name").indexOf(" "))}!</h1>
      <QuickView graphData={graphData}/>
      <StockContainer sectorSelected={"All"} previousSector={"All"}/>
    </div>
  );
};

export default Dashboard;
