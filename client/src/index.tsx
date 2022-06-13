import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { App } from './components/App/App';
import './index.css'
const ROOT_ELEM = document.getElementById('root')!;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  ROOT_ELEM
);