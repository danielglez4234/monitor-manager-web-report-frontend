/*
  * delete duplicates entries
  + TODO: global
  */
  const preventDuplicates = (array) => {
    return array.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.id === value.id
      ))
    )
  }

const selectedMonitorsReducer = (state = [], action) => {
  switch(action.type) {
    case 'add':
      return [ ...state, { ...action.data, }]


    case 'addMultiple':
      return state = preventDuplicates(action.data)


    case 'concatMultiple':
      const data = state.concat(action.data)
      return preventDuplicates(data)


    case 'remove':
      return state.filter((item) => item.id !== action.id);
      

    case 'removeAll':
      return state = [];

    
    case 'saveOptions':
      const newArr = state.map(obj => {
        if (obj.id === action.id)
          return { ...obj, ...action.options }
        return obj
      })
      return newArr

      
    default:
      return state;

  }
}
export default selectedMonitorsReducer;

