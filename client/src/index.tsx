import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { App } from './components/App/App';
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme/theme';
import i18n from './i18n'
import './index.css'
import { I18nextProvider } from 'react-i18next';
const ROOT_ELEM = document.getElementById('root')!;

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
  ROOT_ELEM
);