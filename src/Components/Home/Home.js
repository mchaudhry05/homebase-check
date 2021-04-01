import { Redirect } from "react-router";
import "./homeStyle.css";

/**
 * Home is a component which represents what the
 * user sees when they go on the homepage
 */
const Home = () => {
  if (localStorage.getItem("token") === "passed!") {
    return <Redirect to="/dashboard"></Redirect>;
  }
  return (
    <div className="home-container">
      <div>
        <div className="tagline-image-container">
          <div className="tagline-container">
            <div className="tagline">
              <h1>Keep an Eye</h1>
              <h1>on Your</h1>
              <h1>Investments.</h1>
            </div>
          </div>
          <div className="home-image-container">
            <img className="home-image" src="./images/home.svg"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
