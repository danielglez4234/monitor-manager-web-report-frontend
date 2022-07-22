import {
    getCategory,
    fnIsScalar,
    fnIsArray,
    fnIsMagnitude,
    fnIsState
} from '../../standarFunctions';


const { REACT_APP_IDISPLAYLENGTH } = process.env

/*
 * build pagination params
 */
const getPagination = (pagination, isDownload) => {
    let handlepage
    const actualPage = pagination.actualPage
    if(!pagination?.active || isDownload){
        handlepage = (isDownload && pagination.actualPage !== 1 && pagination.actualPage !== 0) ? actualPage-1 : 0
    }
    else{
        handlepage = 0
    }
    const page = "&page=" + handlepage
    const length = "&length=" + REACT_APP_IDISPLAYLENGTH
    return page + length
}

/*
 * build monitor prefix, unit and decimal options
 */
const buildOptions = (opt) => {
    let queryOpt  = String()
    const unit    = (opt.unit    !== "Default") ? opt.unit    : false
    const prefix  = (opt.prefix  !== "Default") ? opt.prefix  : false
    const decimal = (opt.decimal !== "Default") ? opt.decimal : false
    if (unit || decimal){
        queryOpt += "{"
        if(unit){
            queryOpt += "unit:" + unit
            if(prefix){
                queryOpt += ",prefix:" + prefix
            }
        }
        if(decimal){
            if(unit){
                queryOpt += ","
            }
            queryOpt += "decimal:" + decimal
        }
        queryOpt += "}"
    }
    return queryOpt
}

/*
 * build time range and sampling params
 */
const buildTimeAndSampling = (tm) => {
    const beginDate = tm.beginDate.replace(/\s{1}/,"@")+".000"
    const endDate 	= tm.endDate.replace(/\s{1}/,"@")+".000"
    const sampling  = tm.sampling
    return { beginDate, endDate, sampling }
}

/*
 * buid url params // => main
 */
export default function buildUrl(monitors, timeAndSampling, pagination, isDownload) {
    try {
        let queryRest = String()
        const mlength = monitors.length
        for (let i = 0; i < mlength; i++)
        {
            const infoMonitor = monitors[i];
            const type = infoMonitor.type
            const id = infoMonitor.id
			const component = infoMonitor.name
            const index = infoMonitor.options.pos
 
            queryRest += "id" + getCategory(type) + "=";
            if (fnIsScalar(type)){
                queryRest += id
            }else if (fnIsArray(type)){

                if (index === '/' || index === null || index === ""){
                    queryRest += id + "[[-1]]"
                }else{
                    queryRest += id + "[" + index + "]"
                }
            }else if (fnIsState(type)){
                queryRest += component
            }else{
                console.error("Error: Type is not supported. \n Please contact the system administrator.")
            }
            if(!fnIsMagnitude(type) || !fnIsState(type)){
                queryRest += buildOptions(infoMonitor.options)
            }
            if ((i + 1) < mlength){
                queryRest += "&"
            }
        }
        const tm = buildTimeAndSampling(timeAndSampling)
        const _pagination = getPagination(pagination, isDownload)
        
        return tm.beginDate+"/"+tm.endDate+"/"+tm.sampling+"?"+queryRest+_pagination
    } catch (error) {
        console.error(error)
    }
}