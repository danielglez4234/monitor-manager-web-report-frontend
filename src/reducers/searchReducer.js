const searchReducer = (state = [], action) => {

  switch(action.type) {
    case 'executeSeacrh':
    return {
            perform: action.perform,
            begin_date: action.begin_date,
            end_date: action.end_date,
            sampling: action.sampling,
            searchedMonitors: action.searchedMonitors
          };


    default:
      return state;

  }

}
export default searchReducer;
