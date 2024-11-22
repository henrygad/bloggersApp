import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Authenticateusercontexts, Imagegalarycontext } from './contexts'
import store from './redux/slices/index.ts';
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Authenticateusercontexts Children={
      <Provider store={store} >
       <Imagegalarycontext Children={ <App />} />
      </Provider>
    } />
  </BrowserRouter>
);
