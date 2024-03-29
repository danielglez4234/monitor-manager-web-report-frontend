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
    // const boxplot = opt?.boxplot?.isEnable
    // const onlycollapseValues = opt?.boxplot?.onlyCollapseValues

    const unit    = (opt.unit    !== "Default") ? opt.unit    : false
    const prefix  = (opt.prefix  !== "Default") ? opt.prefix  : false
    const decimal = (opt.decimal !== "Default") ? opt.decimal : false

    // const interval = (opt.boxplot.interval !== "") ? opt.boxplot.interval : false
    // const collapseValue = (opt.boxplot.collapseValue !== "") ? opt.boxplot.collapseValue : false
    
    // if (unit || decimal || boxplot || onlycollapseValues)
    if (unit || decimal)
    {
        queryOpt += "{"
        if(unit){
            queryOpt += `unit:${unit}`
            if(prefix){
                queryOpt += `,prefix:${prefix}`
            }
        }
        if(decimal){
            if(unit){
                queryOpt += ","
            }
            queryOpt += `decimal:${decimal}`
        }

        // if(interval){
        //     if(unit || prefix || decimal){
        //         queryOpt += ","
        //     }
        //     queryOpt += `summary:${interval}`
        //     if(onlycollapseValues){
        //         if(collapseValue){
        //             queryOpt += `,attr:${collapseValue.toLowerCase()}`
        //         }
        //     }
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
        return date.replace(/\s{1}/,"@") + ".000"
    } catch (error) {
        console.error(error)
    }
}

/*
 * build time range and sampling params
 */
const buildTimeAndSampling = (tm) => {
    const beginDate = getFormatDate(tm.beginDate) 
    const endDate 	= getFormatDate(tm.endDate)
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
                if (index === '/' || !index || index === "[-1]"){
                    console.log("🚀 ~ file: buildUrl.js ~ line 116 ~ buildUrl ~ index", index)
                    queryRest += id + "[[-1]]"
                }else{
                    console.log("🚀 ~ file: buildUrl.js ~ line 116 ~ buildUrl ~ index", index)
                    queryRest += id + index
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