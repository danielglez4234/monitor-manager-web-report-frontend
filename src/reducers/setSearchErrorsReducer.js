const setSearchErrorsReducer = (state = false, action) => {

    switch(action.type) {
      case 'errorWhileSearching':    
          return action.searchErrors
  
      default:
        return state;
  
    }
  }
  export default setSearchErrorsReducer;
  