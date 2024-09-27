import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './UnyDataGrid/datagrid.scss'
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhIfkx3RHxbf1x0ZFRMY1xbRHJPIiBoS35RckVqWH1edXVQRGdaVEF2"
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
