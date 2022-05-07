// ---
import React                from 'react';
import { createStore }      from 'redux';
import { Provider }         from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import allReducers          from './components/store';
// import interact             from 'interactjs';
import { SnackbarProvider } from 'notistack';
import Button               from '@mui/material/Button';

// --- React Components link
import Header               from './components/Header';
import ListComponentMonitor from './components/ListComponentMonitor';
import ListSelectedMonitor  from './components/ListSelectedMonitor';
import PerformQuery         from './components/PerformQuery';
import PageNotFound         from './components/handleErrors/PageNotFound';


const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const { REACT_APP_SERVICES_IP }     = process.env;
const { REACT_APP_SERVICES_NAME }   = process.env;
const { REACT_APP_IDISPLAYLENGTH }  = process.env;

function App() {
  	const notistackRef = React.createRef();
	/*
	 * handle close information messages
	 */
	const onClickDismiss = key => () => {
		notistackRef.current.closeSnackbar(key);
	}

	return (
		<SnackbarProvider
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			ref={notistackRef}
			action={(key) => (
				<Button className="snackbar-handle-close" onClick={onClickDismiss(key)}>
					X
				</Button>
			)}
		>
			<Provider store={store}>
				<Router>
					<Routes>
						<Route exact path="/" element={<Navigate to="/WebReport" />} /> {/*blank path redirects to -> /WebReport*/}
						<Route exact path="/WebReport" element={
							<div className="container">
								<Header />
								<div className="content">
									<ListComponentMonitor 
										serviceIP={REACT_APP_SERVICES_IP} 
										serviceName={REACT_APP_SERVICES_NAME} 
										urliDisplayLength={REACT_APP_IDISPLAYLENGTH}
									/>
									<ListSelectedMonitor  
										serviceIP={REACT_APP_SERVICES_IP} 
										serviceName={REACT_APP_SERVICES_NAME} 
										urliDisplayLength={REACT_APP_IDISPLAYLENGTH}
									/>
									<PerformQuery         
										serviceIP={REACT_APP_SERVICES_IP} 
										serviceName={REACT_APP_SERVICES_NAME} 
										urliDisplayLength={REACT_APP_IDISPLAYLENGTH}
									/>
								</div>
							</div>
						} />
						<Route path='*' element={<PageNotFound />} /> {/*only appears when no route matches*/}
					</Routes>
				</Router>
			</Provider>
		</SnackbarProvider>
  	);
}

export default App;
