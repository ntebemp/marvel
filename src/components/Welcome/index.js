import React, { useState, useEffect } from 'react'
import Logout from '../Logout'
import Quiz from '../Quiz'
import { getDoc } from 'firebase/firestore';
import { auth, user } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '../Loader';

const Welcome = () => {

    const navigate = useNavigate();
    const [userSession, setUserSession] = useState(null);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        
        const listener = onAuthStateChanged(auth, user => {
            user ? setUserSession(user) : navigate('/')
        })
        if (!!userSession) {

            const colRef = user(userSession.uid);

            getDoc(colRef)
            .then( snapshot => {
                if (snapshot.exists()) {
                    const docData = snapshot.data(); // objet
                    setUserData(docData);
                }
            })
            .catch( error => {
                console.log(error);
            })
        }

        return () => {
            listener()
        };
    }, [userSession])

    return userSession === null ? (
        <>
        <Loader
                    loadingMsg={"Authentification..."}
                    styling={{textAlign: 'center', color: '#fff'}}
                />
        </>
    ) : (
        <div className="quiz-bg">
            <div className="container">
                <Logout />
                <Quiz userData={userData}/>
            </div>
        </div>
    )
}

export default Welcome
