import selectedMonitorsReducer        from '../../reducers/selectedMonitorsReducer';
import searchReducer                  from '../../reducers/searchReducer';
import loadingButtonReducer           from '../../reducers/loadingButtonReducer';
import setGetResponseReducer          from '../../reducers/setGetResponseReducer';
import getUrlReducer                  from '../../reducers/getUrlReducer';
import reloadGraficReducer            from '../../reducers/reloadGraficReducer';
import loadingGraphicReducer          from '../../reducers/loadingGraphicReducer';
import totalResponseDataReducer       from '../../reducers/totalResponseDataReducer';
import setActualPageReducer           from '../../reducers/setActualPageReducer';

import { combineReducers }     from 'redux';

const allReducers = combineReducers({
  monitor:            selectedMonitorsReducer,
  onSearch:           searchReducer,
  loadingButton:      loadingButtonReducer,
  getResponse:        setGetResponseReducer,
  url:                getUrlReducer,
  reload:             reloadGraficReducer,
  loadingGraphic:     loadingGraphicReducer,
  totalResponseData:  totalResponseDataReducer,
  pagination:         setActualPageReducer
});

export default allReducers;
