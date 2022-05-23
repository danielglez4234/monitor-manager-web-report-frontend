import React, { useEffect, useState } from 'react';
import * as $ 						from 'jquery'
import { useSelector } 				from 'react-redux';
import {
	insertQuery
} from '../../../../services/services'
import { getCategory } from '../../../standarFunctions'
import {makeStyles}					from '@material-ui/core';
import { Modal, Box, Grid, Button, Backdrop, CircularProgress } from '@mui/material';

import ArchiveIcon 					from '@mui/icons-material/Archive';
import SaveIcon                     from '@mui/icons-material/Save';
import LoadingButton                from '@mui/lab/LoadingButton';
import PopUpMessage                 from '../../../handleErrors/PopUpMessage';
import getGraphicoptions            from '../../SelectDisplaySection/Graphic/getGraphicoptions'


const usesTyles = makeStyles({
	savebutton: {
		'&:hover': {
			background: '#e57070',
		},
	},
	handlebutton: {
		'&:hover': {
			background: '#4b6180',
		},
	},
	saveQueryButton: {
		'&:hover': {
			background: '#569d90',
		},
	}
})


function SaveQuery({convertToUnix, constructURL, timeQuery}) {
	const classes = usesTyles()
	const monitor = useSelector(state => state.monitor)
	const [msg, handleMessage] = PopUpMessage()

	const [disabled, setDisabled] = useState(true)
	const [openSaveQuery, setOpenSaveQuery] = useState(false)

    const [queryName, setQueryName] = useState("")
    const [queryDescription, setQueryDescription] = useState("")
    const [openBackDrop, setOpenBackDrop] = useState(false)
    const [monitorList, setMonitorList] = useState([""]);

    const backDropLoadOpen = () => setOpenBackDrop(true)
    const backDropLoadClose = () => setOpenBackDrop(false)

	const handleOpenSaveQuery = () => {
		setOpenSaveQuery(true)
		buildList()
	}
	const handleCloseSaveQuery = () => setOpenSaveQuery(false)

	/*
	 * Show Warning message snackbar
	 */
	const showWarningMessage = (message) => {
		handleMessage({
			message: message,
			type: "warning",
			persist: false,
			preventDuplicate: false
		})
	}


	useEffect(() => {
		// const unixBeginDate = convertToUnix(timeQuery.beginDate)
		// const unixEndDate = convertToUnix(timeQuery.endDate)
		// if(monitor.length > 0 && timeQuery.beginDate !== "" && timeQuery.endDate !== "" && unixBeginDate < unixEndDate){
		if(monitor.length > 0){
			setDisabled(false)
		}else{
			setDisabled(true)
		}
	}, [monitor, timeQuery])


	/*
	 * save query on data base
	 */
	const onSubmit = () => {
		try {
			if(queryName === "" || queryName === undefined){
				showWarningMessage("Name field cannot be empty")
			}
			else{
				backDropLoadOpen()
				saveQuery()
			}
		} catch (error) {
			showWarningMessage(error)
		}
	}

	/*
	 * save query on data base
	 */
	const saveQuery = () => {
		const payload = createPayload()
		console.log("payload", payload)
		Promise.resolve(insertQuery(payload))
		.then(() =>{
			setQueryName("")
			setQueryDescription("")
			handleCloseSaveQuery()
			handleMessage({
				message: "Query save successfully!",
				type: "success",
				persist: false,
				preventDuplicate: false
			})
		})
		.catch((error) =>{
			console.error(error)
			const error_message = (error?.response?.message) ? error.response.message : "Unsupported Error"
			const error_status = (error?.status) ? error.status : "Unkwon"
			handleMessage({
				message: "Error: " + error_message + " - Code " + error_status,
				type: "error",
				persist: true,
				preventDuplicate: false
			})
		}).finally(() => {
			backDropLoadClose()
		})
	}

	/*
	 * buil monitor data list
	 */
	const buildList = () => {
		const monitorOptions = getGraphicoptions()
		let list = []
		for (let i = 0; i < monitor.length; i++) {
			list.push({
				component: monitor[i]?.component,
				id: monitor[i]?.monitorData?.id,
				magnitude: monitor[i]?.monitorData?.magnitude,
				prefix: (monitorOptions?.prefix[i]) ? monitorOptions?.prefix[i] : "None",
				unit: monitorOptions?.unitType[i]
			});
		}
		setMonitorList(list)
	}

	/*
	 * divide monitors by type
	 */
	const getMonitorListSeparator = () => {
		try {
			let [list_monitor, list_magnitude, list_state] = [[],[],[]]
			monitor.map(val => {
				let [id, options] = ["", ""];
				if(getCategory(val.monitorData.type) === "monitor"){
					id = val?.monitorData.id
					options = (val?.options) ? val.options : null
					list_monitor.push({id, options})
				}
				else if(getCategory(val.monitorData.type) === "magnitud"){
					id = val?.monitorData.id
					options = (val?.options) ? val.options : null
					list_magnitude.push({id, options})
				}
				else if(getCategory(val.monitorData.type) === "state"){
					id = val?.monitorData.id
					options = (val?.options) ? val.options : null
					list_state.push({id, options})
				}
			})
			return {list_monitor, list_magnitude, list_state}
		} catch (error) {
			console.log(error)
		}
	}


	const createPayload = () => {
		const name = queryName
		const description = queryDescription
		const created_by = "daniel"
		const monitorList = getMonitorListSeparator()
		const sampling = timeQuery.sampling
		return {name, description, created_by, ...monitorList, sampling}
	}


    return(
		<>
			<Button
				sx={{backgroundColor: '#e57070'}}
				onClick={handleOpenSaveQuery}
				className={classes.savebutton}
				variant="contained"
				startIcon={<ArchiveIcon />}
				disabled={disabled}
			>
				Save Actual Query
			</Button>

		{/*
			Modals
		*/}
			<Modal
				open={openSaveQuery}
				onClose={handleCloseSaveQuery}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="save-query-modal">
					<Grid container spacing={0}>
						<Grid item xs={12} sm={12} md={12} className="save-query-title">
							Save Actual Query
						</Grid>
						<Grid item xs={12} sm={12} md={12} className="save-query-box-title-name">
							<Grid
								container
								spacing={0}
								direction="row"
								justifyContent="flex-start"
								alignItems="center"
								className="save-query-input-title-name"
							>
								<Grid item xs={1} sm={1} md={1} className="save-query-input-title-name">
									name
								</Grid>
								<Grid item xs={10} sm={10} md={10}>
									<input
										className="save-query-input"
										type="text"
										name="name"
										placeholder="query_name"
										value={queryName}
										onChange={(e) => {setQueryName(e.target.value)}}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={12} md={12} className="save-query-box-title-name">
							<Grid
								container
								spacing={0}
								direction="row"
								justifyContent="flex-start"
								alignItems="center"
								className="save-query-input-title-name"
							>
								{/* TODO: cambiar ed 3 2.5 */}
								<Grid item md={3} className="save-query-input-title-name">
									description
								</Grid>
								<Grid item md={8}>
									<input
										className="save-query-input description"
										type="text"
										name="name"
										placeholder="optional"
										value={queryDescription}
										onChange={(e) => {setQueryDescription(e.target.value)}}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={12} md={12} className="save-query-box-title-name save-query-box-title-date">
							<Grid
								container
								spacing={0}
								direction="column"
								justifyContent="flex-start"
								alignItems="left"
								className="save-query-input-title-name save-query-title-date"
							>
								{/* <Grid item md={2} className="save-query-input-title-name">
									<i>Begin date: { timeQuery?.beginDate } </i>
								</Grid>
								<Grid item md={10}>
									<i>End date: { timeQuery?.endDate } </i>
								</Grid> */}
								<Grid item md={10}>
									<i>Sampling: { (timeQuery?.sampling !== "" && timeQuery?.sampling !== "Default") ? timeQuery.sampling  : 0 } microseconds</i>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={12} md={12} className="save-query-list-info-label">
							<Grid container spacing={0} sx={{backgroundColor: "rgb(40, 46, 57)", borderBottom: "3px solid #85e1d0", padding: "3px 0px 3px 15px"}}>
								<Grid item md={12}>Monitors Settings</Grid>
							</Grid>
						</Grid>
						<Grid container spacing={0} className="save-query-list-box">
							<Grid item xs={12} sm={12} md={12}>
								<table id="drop-area" className="save-query-table-monitor-list">
									<tbody>
										{
											(monitorList === "") ? <td></td>
											:
											monitorList.map((value, index) => {
												return (
													<tr key={index} className="save-query-table-tr">
														<td>
															<div className="save-query-table-item-header">
																<p className="sv-component">{value.component}</p>
																<p className="sv-prefix">
																	{(value.prefix === "None" || value.prefix === "") ? "--" : value.prefix} 
																</p>
																<p className="sv-unit"> 
																	{(value.unit === "Default" || value.unit === "") ? "--" : value.unit}
																</p>
															</div>
															<div className="save-query-table-item-title">
																{value.magnitude}
															</div>
														</td>
													</tr>
												);
											})
										}
									</tbody>
								</table>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={12} md={12} className="save-query-saveButton-box">
							<LoadingButton
								size="small"
								sx={{backgroundColor: '#569d90'}}
								className={classes.saveQueryButton}
								onClick={() => {
									onSubmit()
								}}
								loadingPosition="start"
								startIcon={<SaveIcon />}
								variant="contained"
							>
								Save
							</LoadingButton>
						</Grid>
					</Grid>
				</Box>
			</Modal>
			<Backdrop
				sx={{ color: '#569d90', zIndex: (theme) => theme.zIndex.drawer + 13001 }}
				open={openBackDrop}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
	</>

    );
}
export default SaveQuery;
