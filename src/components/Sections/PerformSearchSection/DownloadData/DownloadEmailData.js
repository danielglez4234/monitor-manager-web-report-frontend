import React, { useState, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import { getDownloadData } from '../../../../services/services';
import * as $          from 'jquery';
// import emailjs         from '@emailjs/browser';
import LoadingButton     from '@mui/lab/LoadingButton';
import {
	Button,    
	Stack,           
	Dialog,     
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	useMediaQuery    
} from '@mui/material';

import { useTheme }      from '@mui/material/styles';

// import EmailIcon    from '@mui/icons-material/Email';
import DownloadIcon from '@mui/icons-material/Download';
import HandleMessage from '../../../handleErrors/HandleMessage';


function DownloadEmailData({checkOnSubmit}){
	// const emailForm = useRef();
	const [msg, PopUpMessage] = HandleMessage()

	const ifSearching  = useSelector(state => state.loadingGraphic)

	const [urlDownload, seturlDownload]             = useState("")
	const [activeDisabled, setActiveDisabled]       = useState(false)
	const [openDonwloadModal, setOpenDonwloadModal] = useState(false)
	const [loadingSearch, setLoadingSearch]         = useState(false)

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

	/*
	 * Disable the button when the search is running
	 */
	useEffect(() => {
		if (ifSearching)
			setActiveDisabled(true)
		else
			setActiveDisabled(false)
	}, [ifSearching]);


	/*
	 * Handle Open and close download modal
	 * # we don't use the prevState function here because we are a ui material package to handle it
	 */
	const handleClickOpenDonwload = () => {
		setOpenDonwloadModal(true);
	};
	const handleCloseDonwload = () => {
		setOpenDonwloadModal(false);
	};

	/*
	* Handle Open and close email modal
	*/
	// const handleClickOpenEmail = () => {
	//   setOpenDonwloadModal(true);
	// };
	// const handleCloseEmail = () => {
	//   setOpenDonwloadModal(false);
	// };

	/*
	 * Handle download data
	 */
	const downloadFile = ({data, fileName, fileType}) => {
		const blob = new Blob([data], { type: fileType })
		const a = document.createElement('a')
		a.download = fileName
		a.href = window.URL.createObjectURL(blob)
		const clickEvt = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true,
		})
		a.dispatchEvent(clickEvt)
		a.remove()
	}

	/*
	 * download data to CSV
	 */
	const downloadToCsv = (response) => {
		downloadFile({
			data: response,
			fileName: 'data.csv',
			fileType: 'text/csv',
		})
	}


	/*
	 * Handle Send Email
	 */
	//  const sendEmail = () => {
	//    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailForm.current, 'YOUR_USER_ID')
	//      .then((result) => {
	//          console.log(result.text);
	//      }, (error) => {
	//          console.log(error.text);
	//      });
	//  };


	/*
	 * Get data for donwload
	 */
	const getSamplesFromServerForDownload = async (url) => {
		setLoadingSearch(true);
		console.log("Downloading.....")
		await Promise.resolve( getDownloadData(url) )
		.then(res => {
			console.log("** Downloaded successfully **")
			PopUpMessage({type:'success', message:'Data downloaded successfully'})
			downloadToCsv(res)
		})
		.catch(error => {
			console.error(error)
			const error_message = (error?.response?.message) ? error.response.message : "Unsupported Error"
			const error_status = (error?.status) ? error.status : "Unkwon"
			PopUpMessage({type:'error', message:'Error: '+error_message+' - Code '+error_status})
			console.log("** Fail to download **")
			console.error(error)
		})
		.finally(() => {
			setLoadingSearch(false)
		})
	}

	return(
		<Stack className="perform-query-down-and-email-buttons-box" direction="row" spacing={1}>
			<LoadingButton
				onClick={() => {
					if(checkOnSubmit('download')){
						handleClickOpenDonwload()
						seturlDownload(checkOnSubmit('download'))
					}
				}}
				disabled={activeDisabled}
				loading={loadingSearch}
				loadingPosition="start"
				className="perfrom-query-button-download-data"
				variant="contained"
				startIcon={<DownloadIcon />}
			>
				Download Data
			</LoadingButton>
		{/*
			<Button className="perfrom-query-button-email-data" variant="contained" startIcon={<EmailIcon />}>
			Email Results
			</Button>
		*/}


		{/* DOWNLOAD DIALOG */}
		<Dialog className="dialog-container-set " fullScreen={fullScreen} open={openDonwloadModal} onClose={handleCloseDonwload} aria-labelledby="responsive-dialog-title">
			<DialogTitle id="responsive-dialog-title">
				Donwload
			</DialogTitle>
			<DialogContent>
			<DialogContentText>
				Choose the format to download the data.
				More download formats will be added in the future.
			</DialogContentText>
			<div className="donwload-typeSelect-box">
				<p className="download-text">Type:</p>
				<p className="download-text-type">CSV</p>				
			</div>
			</DialogContent>
			<DialogActions>
			<Button autoFocus onClick={handleCloseDonwload}>
				Cancel
			</Button>
			<Button 
				onClick={() => { 
					handleCloseDonwload(); 
					getSamplesFromServerForDownload(urlDownload) 
				}}
				autoFocus
			>
				Download
			</Button>
			</DialogActions>
		</Dialog>

		{/* EMAIL DIALOG */}
		{/*<Dialog className="dialog-container-set " fullScreen={fullScreen} open={handleClickOpenEmail} onClose={handleCloseEmail} aria-labelledby="responsive-dialog-title">
			<DialogTitle id="responsive-dialog-title">
			Send Email
			</DialogTitle>
			<DialogContent>
			<form ref={emailForm}>
				<label>Name</label>
				<input type="text" name="user_name" />
				<label>Email</label>
				<input type="email" name="user_email" />
				<label>Message</label>
				<textarea name="message" />
			</form>
			</DialogContent>
			<DialogActions>
			<Button autoFocus onClick={handleCloseEmail}>
				Cancel
			</Button>
			<Button onClick={() => { handleCloseEmail(); sendEmail(); }} autoFocus>
				Submit
			</Button>
			</DialogActions>
		</Dialog>*/}
		</Stack>
	);

}
export default DownloadEmailData;
