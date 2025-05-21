import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './redux/store'
import SocketProvider from './contexts/SocketContext.jsx'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorComponent from './components/error/ErrorComponent.jsx'
 
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary FallbackComponent={ErrorComponent}>
      <Provider store={store}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </Provider>
    </ErrorBoundary>
  </BrowserRouter>,
)
