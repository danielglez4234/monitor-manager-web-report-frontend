const loadingButtonReducer = (state = false, action) => {

  switch(action.type) {
    case 'setloadingButton':
    return action.activeOrDisabled

    default:
      return state;

  }
}
export default loadingButtonReducer;
