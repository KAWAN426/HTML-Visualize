import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import awsExports from './aws-exports';
Amplify.configure(awsExports);

sessionStorage.removeItem("isSetEvent");

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
