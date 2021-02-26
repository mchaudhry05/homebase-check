
import firebase from 'firebase/app'; 
import { useClient } from 'homebase-react';

const LoggedInHeader = () =>{
    const [client] = useClient();
    const signOut = e =>{
        firebase.auth().signOut().then(() => {
            
            client.dbFromString(window.emptyDB);
           
          }).catch((error) => {
            alert(error);
          });
    }
    
    return(
        <div className="header-container">
            <div className="logo">
                <a href="/"><h1>check</h1></a>
            </div>
            <div className="sign-in-out"> 

                {
            
                    <a href="/"><button className="sign-up-button" onClick={signOut}>Sign Out</button>
</a>
                }
            </div>
        </div>
    )
}

export default LoggedInHeader;