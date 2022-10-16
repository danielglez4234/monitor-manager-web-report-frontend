import { getDataFromServer } from '../../../services/services';
import 'antd/dist/antd.css';
import { useDispatch } from 'react-redux';
import {
	setloadingButton,
	loadGraphic,
	setSamples,
	setTotalResponseData,
	getUrl,
	setActualPage,
	setSearchErrors
}
from '../../../actions';
import HandleMessage      from '../../handleErrors/HandleMessage';

const { REACT_APP_IDISPLAYLENGTH } = process.env

function HandleSearch({url, sampling}) {
	const dispatch = useDispatch()
	const [msg, PopUpMessage] = HandleMessage()

    const getSamplesFromServer = async () => {
		dispatch(getUrl(url)) // TODO: refactor => eliminar
        /*
         * reset pagination if it is already display
         */
        dispatch(setActualPage(false, 0, 0))
        /*
         * disable reset button while loading
         */
        dispatch(setloadingButton(false))
        /*
         * set start loading grahic
         */
        dispatch(loadGraphic(true))

        /*
         * perform server call
         */
		await Promise.resolve( getDataFromServer(url) )
		.then(res => { 
			const totalArraysRecive  = res.samples.length
			const totalRecords       = res.reportInfo.totalSamples
			const totalPerPage       = REACT_APP_IDISPLAYLENGTH
            /*
             * set samples received
             */
			dispatch(setSamples(res, sampling))
            /*
             * set response metadata info
             */
			dispatch(setTotalResponseData(totalArraysRecive, totalRecords, totalPerPage))
            /*
             * reset errors
             */
			dispatch(setSearchErrors(false))

            // TODO: refactor
			if(totalArraysRecive === 0 && res.reportInfo.totalPages > 1){
                PopUpMessage({type:'default', message:'No data was collected on this page, this may happen if the monitor goes into FAULT state.'})
           }

			console.log(`\
				MonitorsMagnitude Data was recibe successfully!!\n \
				Sampling Period Choosen: ${sampling} microsegundos\n \
				Arrays Recived: ${totalArraysRecive}\n \
				total Records: ${totalRecords}\n \
				----------------------------------------------------------------`
			)
		})
		.catch(error => {
            /*
             * set error
             */
			dispatch(setSearchErrors(true))
			PopUpMessage({type:'error', message:'Error: '})
		})
		.finally(() => {
            /*
             * enable loading button when it stop searching
             */
			dispatch(setloadingButton(true))
            /*
             * stop loading the grahic
             */
			dispatch(loadGraphic(false))
		})
	}

    getSamplesFromServer()
    return ""
}

export default HandleSearch;