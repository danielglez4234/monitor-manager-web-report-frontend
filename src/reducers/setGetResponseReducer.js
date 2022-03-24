const setGetResponseReducer = (state = [], action) => {

  switch(action.type) {
    case 'setSamples':
    return {
            responseData: action.responseData,
            sampling_period: action.sampling_period
           }

    default:
      return state;

  }

}
export default setGetResponseReducer;
