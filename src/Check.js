import { BrowserRouter as Router, Route } from "react-router-dom";
import fire from "./fire";
import LoggedInHeader from "./Components/LoggedInHeader/LoggedInHeader";
import Home from "./Components/Home/Home";
import Dashboard from "./Components/Dashboard/Dashboard";
import Overview from "./Components/Overview/Overview";
import Diversification from "./Components/Diversification/Diversification";
import StockOverview from "./Components/StockOverview/StockOverview";
import { useEntity } from "homebase-react";
import "./App.css";
import { useState } from "react";

const Check = () => {
  const [currentUser] = useEntity({ identity: "currentUser" });
  const [diversificationGraphData, setDiversificationGraphData] = useState();
  return (
    <Router>
      <LoggedInHeader />
      <Route exact path="/" render={() => <Home />}></Route>
      <Route
        exact
        path="/dashboard"
        render={() => (
          <Dashboard
            setDiversificationGraphData={setDiversificationGraphData}
          />
        )}
      ></Route>
      <Route exact path="/overview" render={() => <Overview />}></Route>
      <Route
        exact
        path="/diversification"
        render={() => <Diversification graphData={diversificationGraphData} />}
      ></Route>
      <Route
        exact
        path="/stockoverview/:stockname"
        render={() => <StockOverview />}
      ></Route>
    </Router>
  );
};

export default Check;
