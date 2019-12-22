import React, { useEffect, useState } from 'react';

import './ConfigPosto.css';
import api from '../services/api';

import config from '../assets/icons8-services-24.png'
import home from '../assets/icons8-home-24.png'
import close from '../assets/icons8-close-window-30.png'

export default function Config({ history }) {
    const [agvs, setAGV] = useState([]);

    const [proporcional, setProporcional] = useState(0);
    const [derivativo, setDerivativo] = useState(0);
    const [integrativo, setIntegrativo] = useState(0);
    const [active, setActive] = useState("true");
    const [newAGV, setNewAGV] = useState(0);
   
    useEffect(() => {
        async function loadAGVs() {
            const response = await api.get('/agvs');
            setAGV(response.data);
        }
        loadAGVs();
    }, [], );

    function handleSubmit(e) {
        history.push(`/`);
    }

    function handlePostos(e) {
        history.push(`/config/posto`);
    }

    async function handleAGV(name) {
        const response = await api.post(`/configAGV`, {
            "name": name,
            "proporcional": proporcional,
            "derivativo": derivativo,
            "integrativo": integrativo,
            "active": active
        });
        alert(response);
    }

    async function handleNewAGV() {
        const response = await api.post(`/newagv`, {
            "name": newAGV,
            "proporcional": proporcional,
            "derivativo": derivativo,
            "integrativo": integrativo,
            "active": active
        });

        async function loadAGVs() {
            const response = await api.get('/agvs');
            setAGV(response.data);
        }
        loadAGVs();
        alert(response);
    }

    async function handleDeleteAGV(name) {
        const response = await api.post(`/deleteAGV`, {
            "name": name
        });

        async function loadAGVs() {
            const response = await api.get('/agvs');
            setAGV(response.data);
        }
        loadAGVs();
        alert(response);
    }

    return (
        <div className="config-container">
            <div class="head">
                <ul>
                    <li>
                        <button type="button" onClick={handleSubmit}>
                            <img src={home} alt="home" />
                        </button>
                    </li>
                    <li>
                        <p> Gerenciamento de rotas para AGVs </p>
                    </li>
                    <li>
                        <button type="button" class="button-tex" onClick={handlePostos}>
                            Postos
                        </button>
                    </li>
                    <li>
                        <button type="button" class="button-tex">
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
                {agvs.length > 0 ? (
                    <ul>
                        {agvs.map(agv => (
                            <li key={agv._id}>
                                <div class="li-head">
                                    <button type="button" class="button-close" onClick={() => handleDeleteAGV(agv.name)}>
                                        <img src={close} alt="close" align="right" />
                                    </button>
                                </div>
                                <div class="li-body">
                                    <strong>{agv.name}</strong>
                                    <form onSubmit={() => handleAGV(agv.name)}>
                                        <div class="form-group">
                                            <label for="exampleFormControlSelect1">Posto ativo:</label>
                                            <select class="form-control" id="exampleFormControlSelect1" onChange={e => { setActive(e.target.value) }}>
                                                <option> true </option>
                                                <option> false </option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1"> Constante Proporcional </label>
                                            <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Insira a constante proporcional"
                                                onChange={e => { setProporcional(e.target.value) }} />
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1"> Constante Derivativa </label>
                                            <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Insira a constante derivativa"
                                                onChange={e => { setDerivativo(e.target.value) }} />
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1"> Constante Integrativa </label>
                                            <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Insira a constante integrativa"
                                                onChange={e => { setIntegrativo(e.target.value) }} />
                                        </div>

                                        <button type="submit">Salvar</button>
                                    </form>
                                </div>
                            </li>
                        ))}
                        <li>
                            <div class="li-body-new">
                                <strong>Novo AGV</strong>
                                <form onSubmit={() => handleNewAGV()}>
                                    <div class="form-group">
                                        <label for="exampleFormControlInput1"> Nome do AGV </label>
                                        <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Insira o nome do AGV"
                                            onChange={e => { setNewAGV(e.target.value) }} />
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleFormControlSelect1">Posto ativo:</label>
                                        <select class="form-control" id="exampleFormControlSelect1" onChange={e => { setActive(e.target.value) }}>
                                            <option> true </option>
                                            <option> false </option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleFormControlInput1"> Constante Proporcional </label>
                                        <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Insira a constante proporcional"
                                            onChange={e => { setProporcional(e.target.value) }} />
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleFormControlInput1"> Constante Derivativa </label>
                                        <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Insira a constante derivativa"
                                            onChange={e => { setDerivativo(e.target.value) }} />
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleFormControlInput1"> Constante Integrativa </label>
                                        <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Insira a constante integrativa"
                                            onChange={e => { setIntegrativo(e.target.value) }} />
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
                                        <strong>Novo AGV</strong>
                                        <form onSubmit={() => handleNewAGV()}>
                                            <div class="form-group">
                                                <label for="exampleFormControlInput1"> Nome do AGV </label>
                                                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Insira o nome do AGV"
                                                    onChange={e => { setNewAGV(e.target.value) }} />
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleFormControlSelect1">Posto ativo:</label>
                                                <select class="form-control" id="exampleFormControlSelect1" onChange={e => { setActive(e.target.value) }}>
                                                    <option> true </option>
                                                    <option> false </option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleFormControlInput1"> Constante Proporcional </label>
                                                <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Insira a constante proporcional"
                                                    onChange={e => { setProporcional(e.target.value) }} />
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleFormControlInput1"> Constante Derivativa </label>
                                                <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Insira a constante derivativa"
                                                    onChange={e => { setDerivativo(e.target.value) }} />
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleFormControlInput1"> Constante Integrativa </label>
                                                <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Insira a constante integrativa"
                                                    onChange={e => { setIntegrativo(e.target.value) }} />
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
