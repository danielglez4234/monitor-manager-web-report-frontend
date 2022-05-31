const selectedMonitorsReducer = (state = [], action) => {
  switch(action.type) {
    case 'add':
      const data = action.data
      const reOrderMonitors = [
        ...state, 
        { 
          ...data
        },
      ]
      var first = []
      var others = []
      for (var i = 0; i < reOrderMonitors.length; i++) {
          if (reOrderMonitors[i]["type"] === "e" || reOrderMonitors[i]["type"] === "b") 
              first.push(reOrderMonitors[i])
          else
              others.push(reOrderMonitors[i])
      }
      return [...first, ...others]


    case 'addMultiple':
      return state = action.data


    case 'remove':
      return state.filter((item) => item.id !== action.id);
      

    case 'removeAll':
      return state = [];


    // case 'sort':
    //   let setB = [...state];
    //   return setB.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    

    case 'saveOptions':
      const newArr = state.map(obj => {
        if (obj.id === action.id) {
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

