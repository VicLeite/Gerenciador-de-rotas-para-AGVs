import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import ConfigPosto from './pages/ConfigPosto';
import ConfigAGV from './pages/ConfigAGV';
import Status from './pages/Status';
import Main from './pages/Main';


export default function Routes(){
    return (
        <BrowserRouter>
        <Route path="/" exact component={Main}/>
        <Route path="/config/posto" component={ConfigPosto}/>
        <Route path="/config/agv" component={ConfigAGV}/>
        <Route path="/status" component={Status}/>
        </BrowserRouter>
    );
}