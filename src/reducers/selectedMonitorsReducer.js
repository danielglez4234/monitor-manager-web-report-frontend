const selectedMonitorsReducer = (state = [], action) => {
  switch(action.type) {
    case 'add':
      const data = action.data
      return [
        { 
          ...data,
        },
        ...state
      ]

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

