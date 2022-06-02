// import { getUnit } from '@mui/material/styles/cssUtils';
// import React, {useState} from 'react';
// import {
//     getCategory,
//     fnIsScalar,
//     fnIsArray,
//     fnIsMagnitude,
//     fnIsState
// } from '../../../actions';
// import {useSelector} from 'react-redux';


// const { REACT_APP_IDISPLAYLENGTH } = process.env

// function getPagination(op, pagination){
//     const page = "&page=" 
//     if((op?.paginating && pagination?.active) || op?.download)
//         return page+pagination.actualPage-1
// 	return page+0
// }

// function getUrl(monitor, op){
//     try {			
//         let queryRest = "";
//         for (let i = 0; i < monitor.length; i++)
//         {
//             const infoMonitor = monitor[i];
//             const type = infoMonitor.type
//             const id = infoMonitor.id
//             /* 
//              * magnitud("b","e"); scalar("d","f","l","s","o"); arrays("D","F","L","S","O"); doubleArrays("9","8","7","6","5");
//              * state("state");
//              */
//             queryRest += "id" + getCategory(type) + "=";
//             if (fnIsScalar(type))
//             {
//                 queryRest += id;
//             }
//             else if (fnIsArray(type))
//             {
//                 // Get Index
//                 let index = infoMonitor.pos
//                 if (index === '/' || index === null) 
//                 {
//                     index = "[[-1]]";
//                     queryRest += id + index;
//                 }
//                 else 
//                 {
//                     index = "[" + index + "]";
//                     queryRest += id + index;
//                 }
//             }
//             else if (fnIsState(type))
//             {
//                 queryRest += infoMonitor.component;
//             }
//             else
//             {
//                 console.error("Error: Type is not supported. \n Please contact the system administrator.")
//             }
//             if(!fnIsMagnitude(type) || !fnIsState(type))
//             {
//                 const unit    = (infoMonitor.options.unit    !== "Default") ? infoMonitor.options.unit    : false
//                 const prefix  = (infoMonitor.options.prefix  !== "Default") ? infoMonitor.options.prefix  : false
//                 const decimal = (infoMonitor.options.decimal !== "Default") ? infoMonitor.options.decimal : false
//                 if (unit || decimal){
//                     queryRest += "{"
//                     if(unit){
//                         queryRest += "unit:" + unit
//                         if(prefix){
//                             queryRest += ",prefix:" + prefix
//                         }
//                     }
//                     if(decimal){
//                         if(unit){
//                             queryRest += ","
//                         }
//                         queryRest += "decimal:" + decimal
//                     }
//                     queryRest += "}"
//                 }
//             }
//             if ((i + 1) < monitor.length)
//             {
//                 queryRest += "&";
//             }
//         }
//         const beginDate = op.beginDate.replace(/\s{1}/,"@")+".000"
//         const endDate 	= op.endDate.replace(/\s{1}/,"@")+".000"
//         const sampling  = op.sampling
//         const page 		= getPagination()
//         const length 	= "length="+REACT_APP_IDISPLAYLENGTH

//         const url = beginDate+"/"+endDate+"/"+sampling+"?"+queryRest+"&"+page+"&"+length;

//         // const action = (qs?.download) ? "download" : (qs?.query) ? "query" : "search"; // this is for log purposes
//         // console.log(`URL:  ${window.location.href.replace('3006', '')}:${REACT_APP_SERVER_PORT}/rest/${action}/${encodeURI(url).replace(/#/g,'%23')}`);
//         return url
//     } catch (error) {
//         console.error(error)
//     }
// }


// function constructUrl(op, pagination) {
//     const monitor = useSelector(state => state.monitor)
//     const [currentUrl, setCurrentUrl] = useState(null);

//     if(pagination?.active){
//         return getPagination(currentUrl, pagination)
//     }
//     else{
//         const url = getUrl(monitor, op)
//         setCurrentUrl(url)
//         return url
//     }
// }

// export default constructUrl;