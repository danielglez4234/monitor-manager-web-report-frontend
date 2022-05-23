const selectedMonitorsReducer = (state = [], action) => {
  switch(action.type) {
    case 'getSelectedMonitor':
      let reOrderMonitors = [
        ...state,
          {
            monitorData: action.monitorData,
            component: action.component
          }
      ];
      const sortEnumFirst = (data) => {
        var first = [];
        var others = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].monitorData["type"] === "e" || data[i].monitorData["type"] === "b") {
                first.push(data[i]);
            } else {
                others.push(data[i]);
            }
        }
        return [...first, ...others]
      }
      return sortEnumFirst(reOrderMonitors)


    case 'diselectMonitor':
      return state.filter((item) => item.monitorData.id !== action.idMonitorMagnitude);
      

    case 'diselectALLMonitor':
      return state = [];


    case 'sortMonitors':
      let setB = [...state];
      return setB.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    

    case 'saveMonitorOptions':
      const newArr = state.map(obj => {
        if (obj.monitorData.id === action.idMonitorMagnitude) {
          return {...obj, ...action.options}
        }
        return obj
      })
      return newArr

      
    default:
      return state;

  }
}
export default selectedMonitorsReducer;
