import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import App from './uiComponents/AppContainer';
import {store} from './store/configureStore';
import {Provider} from 'react-redux';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
    </StrictMode>
);