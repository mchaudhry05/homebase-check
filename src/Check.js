import { BrowserRouter as Router, Route} from "react-router-dom";
import fire from './fire';
import LoggedInHeader from './Components/LoggedInHeader/LoggedInHeader';
import Home from './Components/Home/Home';
import Dashboard from "./Components/Dashboard/Dashboard";
import './App.css';


const Check = () =>{
    return(
        <Router>
            <LoggedInHeader/>
            <Route exact path="/" render={() => <Home/>}></Route>
            <Route exact path="/dashboard" render={() => <Dashboard/>}></Route>
        </Router>
    )
}

export default Check;
