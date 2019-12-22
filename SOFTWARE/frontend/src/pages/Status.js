import React, { useState } from 'react'

import './Status.css';
import io from '../socketio'

import config from '../assets/icons8-services-24.png'
import home from '../assets/icons8-home-24.png'

export default function Main({ history }) {
    const [status, setStatus] = useState([])

    io.on('/status', event => {
        setStatus([...status, event])
    })

    function handleHome(e) {
        history.push(`/`);
    }

    function handleConfig(e) {
        history.push(`/config/posto`);
    }

    return (
        <div className="status-container">
            <div className="head">
                <ul className="ul-head">
                    <li>
                        <button type="button" onClick={handleHome}>
                            <img src={home} alt="home" />
                        </button>
                    </li>
                    <li>
                        <p> Gerenciamento de rotas para AGVs </p>
                    </li>

                    <li>
                        <button type="button" >
                            <p> Status </p>
                        </button>
                    </li>

                    <li>
                        <button type="button" onClick={handleConfig}>
                            <img src={config} alt="config" />
                        </button>
                    </li>

                </ul>
            </div>
            <div className="body">
                <strong>Informações</strong>
                {status.length > 0 ? (
                    <ul class="list-group">
                        {status.map(status => (
                            <li key={status} class="list-group-item list-group-item-light">{status}</li>
                        ))}
                    </ul>
                ) : (
                        <ul class="list-group">
                            <li key={status} class="list-group-item list-group-item-light"> Sem status </li>
                        </ul>
                    )}
            </div>
        </div>
    )
}
        
