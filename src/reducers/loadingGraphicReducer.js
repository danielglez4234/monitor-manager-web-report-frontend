const loadingGraphicReducer = (state = false, action) => {

  switch(action.type) {
    case 'loadgraphic':
    return action.loading

    default:
      return state;

  }
}
export default loadingGraphicReducer;
