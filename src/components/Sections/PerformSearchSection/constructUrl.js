import { getUnit } from '@mui/material/styles/cssUtils';
import React, {useState} from 'react';
import {
    getCategory,
    fnIsScalar,
    fnIsArray,
    fnIsMagnitude,
    fnIsState
} from '../../../actions'
import {useSelector} from 'react-redux';


function getPagination(){

}

function getUrl(monitor, op){
    try {			
        let queryRest = "";
        for (let i = 0; i < monitor.length; i++)
        {
            const infoMonitor = monitor[i];
            /* 
             * magnitud("b","e"); scalar("d","f","l","s","o"); arrays("D","F","L","S","O"); doubleArrays("9","8","7","6","5");
             * state("state");
             */
            queryRest += "id" + getCategory(infoMonitor.type) + "=";
            if (fnIsScalar(infoMonitor.type))
            {
                queryRest += infoMonitor.id;
            }
            else if (fnIsArray(infoMonitor.type))
            {
                // Get Index
                let index = $(".Index" + infoMonitor.id).text();
                if (index === '/') 
                {
                    index = "[[-1]]";
                    queryRest += infoMonitor.id + index;
                }
                else 
                {
                    index = "[" + index + "]";
                    queryRest += infoMonitor.id + index;
                }
            }
            else if (fnIsState(infoMonitor.type))
            {
                queryRest += infoMonitor.component;
            }
            else
            {
                console.error("Error: Type is not supported. \n Please contact the system administrator.")
            }
            if(!fnIsMagnitude(infoMonitor.type) || !fnIsState(infoMonitor.type))
            {
                // let unitType = $("#Unit" + infoMonitor.id).val();
                // let prefixType = $("#Prefix" + infoMonitor.id).val();
                // let decimalPattern = $("#Pattern" + infoMonitor.id).val();
                let unitType = infoMonitor.unit
                let prefixType = infoMonitor.prefix
                let decimalPattern = infoMonitor.decimal

                if (unitType !== "Default" || decimalPattern !== "Default"){
                    queryRest += "{"
                    if(unitType !== "Default"){
                        queryRest += "unit:" + unitType
                        if(prefixType !== "Default"){
                            queryRest += ",prefix:" + prefixType
                        }
                    }
                    if(decimalPattern !== "Default"){
                        if(unitType !== "Default"){
                            queryRest += ","
                        }
                        queryRest += "decimal:" + decimalPattern
                    }
                    queryRest += "}"
                }
            }
            if ((i + 1) < monitor.length)
            {
                queryRest += "&";
            }
        }

        const beginDate = op.beginDate.replace(/\s{1}/,"@")+".000"
        const endDate 	= op.endDate.replace(/\s{1}/,"@")+".000"
        const sampling  = op.sampling
        const page 		= "page=" + 0
        // const length 	= "length=" + props.urliDisplayLength;

        // const url = beginDate+"/"+endDate+"/"+sampling+"?"+queryRest+"&"+page+"&"+length;

        // const action = (qs?.download) ? "download" : (qs?.query) ? "query" : "search"; // this is for log purposes
        // console.log(`URL:  ${window.location.href.replace('3006', '')}:${REACT_APP_SERVER_PORT}/rest/${action}/${encodeURI(url).replace(/#/g,'%23')}`);
        // return url
    } catch (error) {
        console.error(error)
    }
}


function constructUrl(op) {
    const monitor = useSelector(state => state.monitor)
    const pagination = useSelector(state => state.pagination)
    const [currentUrl, setCurrentUrl] = useState(null);

    if(op?.pagination){
        return getPagination(currentUrl, pagination)
    }
    else{
        const url = getUrl(monitor, op)
        setCurrentUrl(url)
        return url
    }
}

export default constructUrl;