import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ReactDOM from 'react-dom/client';
import './index.css'
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'; 
import { store } from './stores';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

