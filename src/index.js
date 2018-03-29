import React from 'react';
import ReactDOM from 'react-dom';
import VirtualTable from './components/VirtualTable';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<VirtualTable />, document.getElementById('root'));
registerServiceWorker();
