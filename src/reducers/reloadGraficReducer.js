const reloadGraficReducer = (state = 0, action) => {

  switch(action.type) {
    case 'reload':
    var set = state + 1
    return set

    default:
      return state;

  }
}
export default reloadGraficReducer;
