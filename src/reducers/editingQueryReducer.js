const editingQueryReducer = (state = {}, action) => {

    switch(action.type) {
      case 'editingQuery':
        return action.data
        
  
      default:
        return state;
  
    }
  
  }
  export default editingQueryReducer;
  