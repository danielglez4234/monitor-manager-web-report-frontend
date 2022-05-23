import axios from "axios";

/*
 * get server name from .env
 */
const { REACT_APP_SERVICES_IP } = process.env;

/*
 * set headers properties to avoid CORS rejection
 */
const httpHeaderOptions = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

/*
 * calling /components to get all components
 */
export const getComponents = () => {
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/components", {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * calling /ccomponents/<componentName> to get all monitors from a component
 */
export const getMonitorsFromComponent = ({componentName}) => {
    // console.log(componentName);
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/components/" + componentName, {header: httpHeaderOptions})
        .then(res => {
            const enumList  = res.data.magnitudeDescriptions;
            const escalList = res.data.monitorDescription;
            if (enumList.length > 0 || escalList.length > 0) 
            {
                return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/state_definition", {header: httpHeaderOptions})
                    .then(res =>  {           
                    const stateInfo = {
                        magnitude: 'STATE',
                        type: 'state',
                        stateValues: res.data
                    };
                    const concatMonitors  = [...escalList, ...enumList, stateInfo];
                    return concatMonitors;
                })
            }
            else 
            {
                return false;
            }
        });
}

/*
 * calling /search to get the data 
 */
export const getDataFromServer = ({url}) => {
    const replacePad = fnReplacePad(encodeURI(url));
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/search/" + replacePad, {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * calling /download to get csv transform data
 */
export const getDownloadData = ({url}) => {
    const replacePad = fnReplacePad(encodeURI(url));
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/download/" + replacePad, {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * calling compatible conversion for a Unit type
 */
export const getUnitConversion = (unitType) => {
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/units/" + encodeURI(unitType), {header: httpHeaderOptions})
            .then(res => res.data)
}

// apaño temporal hacia el backend --> replace '###' por %23 forzando el cambio de esta forma para evitar errores
const fnReplacePad = (url) => { return url.replace(/#/g, '%23') }


/*
-------------------------------
*
* STORE QUERY ROUTES
*
-------------------------------
*/


/*
 * GET all querys
 */
export const getAllQuerys = () => {
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/query/", {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 *  GET specific query
 */
export const getQuery = (id) => {
    return axios.get(REACT_APP_SERVICES_IP + `/WebReport/rest/query/${id}`, {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * POST a new query
 */
export const insertQuery = (payload) => {
    return axios.post(REACT_APP_SERVICES_IP + "/WebReport/rest/query/", payload, {header: httpHeaderOptions})
            .then(res => res.data)
}


/*
 * UPDATE a new query
 */
export const updateQuery = (id, payload) => {
    return axios.post(REACT_APP_SERVICES_IP + `/WebReport/rest/query/${id}`, payload, {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * Remove query
 */
export const deleteQuery = (id) => {
    return axios.delete(REACT_APP_SERVICES_IP + `/WebReport/rest/query/${id}`, {header: httpHeaderOptions})
            .then(res => res.data)
}