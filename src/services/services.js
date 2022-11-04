import axios from "axios";
/*
 * get server name from .env
 */
const { REACT_APP_SERVICES_IP, REACT_APP_SERVER_PORT} = process.env;

// apaño temporal hacia el backend --> replace '###' por %23 forzando el cambio de esta forma para evitar errores
const fnReplacePad = (val) => val.replace(/#/g, '%23');

/*
 * log url request in console
 */
const logUrl = (params, route, action) => {
    console.log(`URL - ${action}: ${window.location.href.replace('3006', REACT_APP_SERVER_PORT)}/rest/${route}/${params.replace(/#/g,'%23')}`);
}

/*
 * set headers properties to avoid CORS rejection
 */
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};


/*
-------------------------------
*
* GET MONITORS DATA ROUTES
*
-------------------------------
*/


/*
 * GET all components
 */
export const getComponents = async () => {
    const res = await axios.get(`${REACT_APP_SERVICES_IP}/WebReport/rest/components`, {header: headers});
    return res.data;
}

/*
 * GET all monitors from a component
 */
export const getMonitorsFromComponent = async (componentName) => {
    const res = await axios.get(`${REACT_APP_SERVICES_IP}/WebReport/rest/components/${componentName}`, {header: headers});
    return res.data;
}

/*
 * GET the data 
 */
export const getDataFromServer = async (url) => {
    const url_ecd = fnReplacePad(encodeURI(url))
    logUrl(url_ecd, "search", "GET")
    const res = await axios.get(`${REACT_APP_SERVICES_IP}/WebReport/rest/search/${url_ecd}`, {header: headers});
    return res.data;
}

/*
 * GET csv transform data
 */
export const getDownloadData = async (url) => {
    const url_ecd = fnReplacePad(encodeURI(url))
    logUrl(url_ecd, "download", "GET")
    const res = await axios.get(`${REACT_APP_SERVICES_IP}/WebReport/rest/download/${url_ecd}`, {header: headers});
    return res.data;
}

/*
 * GET compatible conversion for a Unit type
 */
export const getUnitConversion = async (unitType) => {
    const res = await axios.get(`${REACT_APP_SERVICES_IP}/WebReport/rest/units/${encodeURI(unitType)}`, {header: headers});
    return res.data;
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
export const getAllQuerys = async () => {
    const res = await axios.get(`${REACT_APP_SERVICES_IP}/WebReport/rest/query/`, {header: headers});
    return res.data;
}

/*
 * get query by name 
 */
export const getQueryByName = async (name) => {
    const res = await axios.get(`${REACT_APP_SERVICES_IP}/WebReport/rest/query/${encodeURI(name)}`, {header: headers});
    return res.data;
}

/*
 * POST a new query
 */
export const insertQuery = async (payload) => {
    const res = await axios.post(`${REACT_APP_SERVICES_IP}/WebReport/rest/query/`, payload, {header: headers});
    return res.data;
}

/*
 * UPDATE a new query
 */
export const updateQuery = async (name, payload) => {
    const params_ecd = fnReplacePad(encodeURI(name))
    const res = await axios.put(`${REACT_APP_SERVICES_IP}/WebReport/rest/query/${params_ecd}`, payload, {header: headers});
    return res.data;
}

/*
 * DELETE query
 */
export const deleteQuery = async (params) => {
    const params_ecd = fnReplacePad(encodeURI(params))
    const res = await axios.delete(`${REACT_APP_SERVICES_IP}/WebReport/rest/query?${params_ecd}`, {header: headers});
    return res.data;
}


/*
-------------------------------
*
* SUMMARY ROUTES
*
-------------------------------
*/

/*
 * GET INTERVALS OF
 */
export const getSummaryIntervals = async (component, magnitude) => {
    const magnitude_ecd = fnReplacePad(encodeURI(magnitude))
    const component_ecd = fnReplacePad(encodeURI(component))
    const res = await axios.get(`${REACT_APP_SERVICES_IP}/WebReport/rest/components/${component_ecd}/monitors/${magnitude_ecd}/summary`, {header: headers});
    return res.data;
}