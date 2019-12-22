import React, { useEffect, useState } from 'react';

import './Main.css';

import api from '../services/api';
import config from '../assets/icons8-services-24.png'
import home from '../assets/icons8-home-24.png'

export default function Main({ history }) {
    const [postos, setPostos] = useState([])

    useEffect(
        () => {
            async function loadPostos() {
                const response = await api.get('/postos')
                setPostos(response.data)
            }
            loadPostos()
        },
        [],
    )

    function handleConfig(e) {
        history.push(`/config/posto`);
    }

    function handleStatus(e) {
        history.push(`/status`);
    }


    async function handleService(name){
        const response = await api.post(`/service`,
          { "posto": name },
        );
       alert(response);
    }

    return (
        <div className="main-container">
            <div class="head">
                <ul class = "ul-head">
                    <li>
                        <button type="button">
                            <img src={home} alt="home" />
                        </button>
                    </li>
                    <li>
                        <p> Gerenciamento de rotas para AGVs </p>
                    </li>

                    <li>
                        <button type="button" onClick={handleStatus}>
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
            <div class="body">
                <div class="posto">
                    {postos.length > 0 ? (
                        <ul>
                            {postos.map(posto => (
                                <li key={posto._id}>
                                    <strong>{posto.name}</strong>
                                    <button type="button" onClick={() => handleService(posto.name)}>
                                        <p> {posto.type} </p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                            <div className="empty">Acabou :(</div>
                        )}
                </div>
            </div>
        </div>
    );
}