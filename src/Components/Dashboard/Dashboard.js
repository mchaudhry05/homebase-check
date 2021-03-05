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
const Dashboard = () => {
  const [displayName, setDisplayName] = useState("");
  const [currentUser] = useEntity({ identity: "currentUser" });

  return (
    <div className="dashboard-container">
      <h1>Hello, {currentUser.get("name")}!</h1>
      <QuickView />
      <StockContainer />
    </div>
  );
};

export default Dashboard;
