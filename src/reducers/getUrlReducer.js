const getUrlReducer = (state = [], action) => {

  switch(action.type) {
    case 'getUrl':
      return action.url


    default:
      return state;

  }

}
export default getUrlReducer;
