import React, { useState, useEffect} from 'react'
import { auth } from '../Firebase/firebase';
import {useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth';
import { Tooltip } from 'react-tooltip'


const Logout = () => {

    const navigate = useNavigate();

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (checked) {
            signOut(auth)
            .then(() => {
                console.log('Vous êtes déconnecté')
                setTimeout(()=> {
                    navigate('/')
                },1000)
              }).catch((error) => {
                console.log('Oups une erreur est parvenue')
              });
        }

    }, [checked]);

    const handleChange = event => {
        setChecked(event.target.checked);
    }

    return (
        <div className="logoutContainer">
            <label className="switch">
                <input 
                    onChange={handleChange}
                    type="checkbox"
                    checked={checked}
                />
                <span className="slider round" data-tooltip-id="my-tooltip" data-tooltip-content="Déconnexion"></span>

            </label>
            <Tooltip 
                id="my-tooltip" 
                place="left"
                effect="solid"
            />
        </div>
    )
}

export default Logout
