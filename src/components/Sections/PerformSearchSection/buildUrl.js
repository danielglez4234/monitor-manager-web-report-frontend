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
    if(!pagination?.active || isDownload){ // pagination?.active === false
        handlepage = (isDownload && pagination.actualPage !== 1) ? pagination.actualPage-1 : 0
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
    // const summary = (opt.summary.length > 0) ? opt.summary : null
    // const collapseValue = (opt.collapseValues.length > 0) ? opt.collapseValues : null
    // const boxplot = opt?.boxplot?.isEnable
    // const onlycollapseValues = opt?.boxplot?.onlycollapseValues
    
    if (unit || decimal)
    {
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
        // if(boxplot || onlycollapseValues){
        //     queryOpt += `", sumary:"${summary}`
        //     if(onlycollapseValues)
        //         queryOpt += `, attr:${collapseValue}`
        // }
        queryOpt += "}"
    }
    return queryOpt
}

/*
 * get format date
 */
const getFormatDate = (date) => {
    try {
        return date.replace(/\s{1}/,"@")
    } catch (error) {
        console.error(error)
    }
}

/*
 * build time range and sampling params
 */
const buildTimeAndSampling = (tm) => {
    const beginDate = getFormatDate(tm.beginDate) + ".000"
    const endDate 	= getFormatDate(tm.endDate) + ".000"
    const sampling  = "&sampling=" + tm.sampling
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
                if (index === '/' || !index){
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
        
        return tm.beginDate + "/" + tm.endDate + "/?" + queryRest + tm.sampling + _pagination
    } catch (error) {
        console.error(error)
    }
}