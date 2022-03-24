const totalResponseDataReducer = (state = [], action) => {

  switch(action.type) {
    case 'setTotalResponseData':
    return {
            totalArrays: action.totalArrays,
            totalRecords: action.totalRecords,
            totalPerPage: action.totalPerPage
          };

    default:
      return state;

  }

}
export default totalResponseDataReducer;
