import { render } from 'react-dom';

import { configure } from 'mobx';

import { App } from './app';

import './index.css';

configure({ enforceActions: 'observed' });

const appContainer = document.createElement('div');
appContainer.className = 'app-container';
document.body.appendChild(appContainer);

render(<App />, appContainer);
