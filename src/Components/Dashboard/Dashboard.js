import { useClient, useTransact, useQuery, useEntity, Transaction, Entity} from 'homebase-react';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import './dashboardStyle.css';

const Dashboard = ( ) =>{
    const [displayName, setDisplayName] = useState("");
    const [currentUser] = useEntity({ identity: 'currentUser' });
    //const [newUser] = useEntity({user: {uid: currentUser.get('uid')}});
    //console.log(newUser.name);
    
    
  
    return(
        <div className="dashboard-container">
            <h1>Hello, {currentUser.get('name')}!</h1>
        </div>
    )
}

export default Dashboard;