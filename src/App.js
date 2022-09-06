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
import { SnackbarProvider } from 'notistack';
import Button               from '@mui/material/Button';

import Header               from './components/Sections/Header';
import ListComponentMonitor from './components/Sections/ListComponentMonitorSection/ListComponentMonitor';
import SelectDisplay        from './components/Sections/SelectDisplaySection/SelectDisplay';
import PerformQuery         from './components/Sections/PerformSearchSection/PerformQuery';
import PageNotFound         from './components/handleErrors/PageNotFound';


const store = createStore(
  	allReducers,
  	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

function App() {
  	const notistackRef = React.createRef()

	/*
	 * handle close Snackbar messages
	 */
	const onClickDismiss = key => () => {
		notistackRef.current.closeSnackbar(key)
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
									<ListComponentMonitor />
									<SelectDisplay />
									<PerformQuery />
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
