import axios from "axios";
/*
 * get server name from .env
 */
const { REACT_APP_SERVICES_IP, REACT_APP_SERVER_PORT } = process.env;

// apaño temporal hacia el backend --> replace '###' por %23 forzando el cambio de esta forma para evitar errores
const fnReplacePad = (val) => { return val.replace(/#/g, '%23') }

/*
 * log url request in console
 */
const logUrl = (params, route, action) => {
    console.log(`URL - ${action}: ${window.location.href.replace('3006', REACT_APP_SERVER_PORT)}/rest/${route}/${encodeURI(params).replace(/#/g,'%23')}`);
}

/*
 * set headers properties to avoid CORS rejection
 */
const httpHeaderOptions = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

/*
 * GET all components
 */
export const getComponents = () => {
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/components", {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * GET all monitors from a component
 */
export const getMonitorsFromComponent = (componentName) => {
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/components/" + componentName, {header: httpHeaderOptions})
            .then(res => res.data)
}


/*
 * GET the data 
 */
export const getDataFromServer = ({url}) => {
    const replacePad = fnReplacePad(encodeURI(url));
    logUrl(replacePad, "search", "GET")
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/search/" + replacePad, {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * GET csv transform data
 */
export const getDownloadData = ({url}) => {
    const replacePad = fnReplacePad(encodeURI(url));
    logUrl(replacePad, "download", "GET")
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/download/" + replacePad, {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * GET compatible conversion for a Unit type
 */
export const getUnitConversion = (unitType) => {
    return axios.get(REACT_APP_SERVICES_IP + "/WebReport/rest/units/" + encodeURI(unitType), {header: httpHeaderOptions})
            .then(res => res.data)
}



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
    return axios.get(`${REACT_APP_SERVICES_IP}/WebReport/rest/query/${encodeURI(id)}`, {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * POST a new query
 */
export const insertQuery = (payload) => {
    logUrl(payload, "query", "POST")
    return axios.post(`${REACT_APP_SERVICES_IP}/WebReport/rest/query/`, payload, {header: httpHeaderOptions})
            .then(res => res.data)
}


/*
 * UPDATE a new query
 */
export const updateQuery = (name, payload) => {
    const replacePad = fnReplacePad(encodeURI(name));
    logUrl(replacePad, "query", "PUT")
    return axios.put(`${REACT_APP_SERVICES_IP}/WebReport/rest/query/${replacePad}`, payload, {header: httpHeaderOptions})
            .then(res => res.data)
}

/*
 * DELETE query
 */
export const deleteQuery = (id) => {
    const replacePad = fnReplacePad(encodeURI(id));
    return axios.delete(`${REACT_APP_SERVICES_IP}/WebReport/rest/query/${replacePad}`, {header: httpHeaderOptions})
            .then(res => res.data)
}