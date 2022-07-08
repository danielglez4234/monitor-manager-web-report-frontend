const selectedMonitorsReducer = (state = [], action) => {
  switch(action.type) {
    case 'add':
      return [
        { 
          ...action.data,
        },
        ...state
      ]


    case 'addMultiple':
      return state = action.data


    case 'concatMultiple':
      // const removeDuplicates = action.data.filter((item) => item)
      return action.data.concat(state)


    case 'remove':
      return state.filter((item) => item.id !== action.id);
      

    case 'removeAll':
      return state = [];

    
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

