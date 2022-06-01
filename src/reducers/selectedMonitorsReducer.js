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
        let last = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].monitorData["type"] === "e" || data[i].monitorData["type"] === "b") {
                first.push(data[i]);
            } 
            else if(data[i].monitorData["type"] === "state"){
                last.push(data[i]);
            }
            else {
                others.push(data[i]);
            }
        }
        return [...first, ...others, ...last]
      }
      return sortEnumFirst(reOrderMonitors)

    case 'diselectMonitor':
      return state.filter((item) => item.monitorData.id !== action.idMonitorMagnitude);
      

    case 'diselectALLMonitor':
      return state = [];


    case 'sortMonitors':
      let setB = [...state];
      return setB.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));


    default:
      return state;

  }
}
export default selectedMonitorsReducer;
