import React, { useEffect, useState } from 'react';
import './ConfigPosto.css';

import api from '../services/api';

import config from '../assets/icons8-services-24.png'
import home from '../assets/icons8-home-24.png'
import close from '../assets/icons8-close-window-30.png'

export default function Config({ history }) {

    const [postos, setPostos] = useState([]);
    const [type, setType] = useState("Carga");
    const [trajetoria, setTrajetoria] = useState({ "comands": [0, 0, 0, 0] });
    const [newPosto, setNewPosto] = useState("Posto");

    useEffect(() => {
        async function loadPostos() {
            const response = await api.get('/postos');
            setPostos(response.data);
        }
        loadPostos();
    },
    [],);

    function handleSubmit(e) {
        history.push(`/`);
    }

    function handleAGV(e) {
        history.push(`/config/agv`);
    }

    async function handlePosto(name) {
        const response = await api.post(`/configPosto`, {
            "name": name,
            "type": type,
            "trajetoria": trajetoria
        });
        alert(response);
    }

    async function handleNewPosto() {
        const response = await api.post(`/newPosto`, {
            "name": newPosto,
            "type": type,
            "trajetoria": trajetoria
        });
        async function loadPostos() {
            const response = await api.get('/postos');
            setPostos(response.data);
        }
        loadPostos();
        alert(response);
    }

    async function handleDeletePosto(name) {
        const response = await api.post(`/deletePosto`, {
            "name": name
        });
        async function loadPostos() {
            const response = await api.get('/postos');
            setPostos(response.data);
        }
        loadPostos();
        alert(response);
    }

    return (
        <div className="config-container">
            <div class="head">
                <ul class="ul-head">
                    <li>
                        <button type="button" onClick={handleSubmit}>
                            <img src={home} alt="home" />
                        </button>
                    </li>
                    <li>
                        <p> Gerenciamento de rotas para AGVs </p>
                    </li>
                    <li>
                        <button type="button" class="button-tex">
                            Postos
                        </button>
                    </li>
                    <li>
                        <button type="button" class="button-tex" onClick={handleAGV}>
                            AGV's
                        </button>
                    </li>

                    <li>
                        <button type="button">
                            <img src={config} alt="config" />
                        </button>
                    </li>
                </ul>
            </div>
            <div class="body">
                {postos.length > 0 ? (
                    <ul>
                        {postos.map(posto => (
                            <li key={posto._id}>

                                <div class="li-head">
                                    <button type="button" class="button-close" onClick={() => handleDeletePosto(posto.name)}>
                                        <img src={close} alt="close" align="right" />
                                    </button>
                                </div>

                                <div class="li-body">
                                    <strong>{posto.name}</strong>
                                    <form onSubmit={() => handlePosto(posto.name)}>
                                        <div class="form-group">
                                            <label for="exampleFormControlSelect1">Tipo do posto</label>
                                            <select class="form-control" id="exampleFormControlSelect1" onChange={e => { setType(e.target.value) }}>
                                                <option> Carga </option>
                                                <option> Descarga </option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1"> Trajetória </label>
                                            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Insira a trajetória"
                                                onChange={e => { setTrajetoria(e.target.value) }} />
                                        </div>
                                        <button type="submit">Salvar</button>
                                    </form>
                                </div>
                            </li>
                        ))}

                        <li>
                            <div class="li-body-new">
                                <strong>Novo Posto</strong>
                                <form onSubmit={() => handleNewPosto()}>
                                    <div class="form-group">
                                        <label for="exampleFormControlInput1"> Nome do Posto </label>
                                        <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Insira o nome do posto"
                                            onChange={e => { setNewPosto(e.target.value) }} />
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleFormControlSelect1">Tipo do posto</label>
                                        <select class="form-control" id="exampleFormControlSelect1" onChange={e => { setType(e.target.value) }}>
                                            <option> Carga </option>
                                            <option> Descarga </option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="exampleFormControlInput1"> Trajetória </label>
                                        <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Insira a trajetória"
                                            onChange={e => { setTrajetoria(e.target.value) }} />
                                    </div>
                                    <button type="submit">Adcionar</button>
                                </form>
                            </div>
                        </li>
                    </ul>
                ) : (
                        <div>
                            <ul>
                                <li>
                                    <div class="li-body-new">
                                        <strong>Novo Posto</strong>
                                        <form onSubmit={() => handleNewPosto()}>
                                            <div class="form-group">
                                                <label for="exampleFormControlInput1"> Nome do Posto </label>
                                                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Insira o nome do posto"
                                                    onChange={e => { setNewPosto(e.target.value) }} />
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleFormControlSelect1">Tipo do posto</label>
                                                <select class="form-control" id="exampleFormControlSelect1" onChange={e => { setType(e.target.value) }}>
                                                    <option> Carga </option>
                                                    <option> Descarga </option>
                                                </select>
                                            </div>

                                            <div class="form-group">
                                                <label for="exampleFormControlInput1"> Trajetória </label>
                                                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Insira a trajetória"
                                                    onChange={e => { setTrajetoria(e.target.value) }} />
                                            </div>
                                            <button type="submit">Adcionar</button>
                                        </form>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}
            </div>
        </div>
    );
}
