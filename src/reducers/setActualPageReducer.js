const setActualPageReducer = (state = 1, action) => {

  switch(action.type) {
    case 'setActualPage':
    return {
      active: action.active,
      displayLength: action.displayLength,
      actualPage: action.actualPage,
      totalPages: action.totalPages
    }

    default:
      return state;

  }

}
export default setActualPageReducer;
