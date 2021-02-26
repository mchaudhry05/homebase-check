import './homeStyle.css'; 

const Home = () =>{
    return(
        <div className="home-container">
            <div className="tagline">
                <h1>Keep an Eye</h1>
                <h1>on Your</h1>
                <h1>Investments.</h1>
            </div>
            <div className="image-container">
                <img src="./home-image.png" alt="home.png"></img>
            </div>
        </div>
    )
}

export default Home; 
