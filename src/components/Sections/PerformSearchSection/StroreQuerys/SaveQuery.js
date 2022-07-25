import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editingQuery, handleSelectedElemets, setloadingButton } from '../../../../actions';
import {
	insertQuery,
	updateQuery
} from '../../../../services/services'
import { getCategory, fnIsState } from '../../../standarFunctions'
import {makeStyles}					from '@material-ui/core';
import { Modal, Box, Grid, Button, Backdrop, CircularProgress } from '@mui/material';

import ArchiveIcon 					from '@mui/icons-material/Archive';
import SaveIcon                     from '@mui/icons-material/Save';
import LoadingButton                from '@mui/lab/LoadingButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

import HandleMessage                 from '../../../handleErrors/HandleMessage';


const usesTyles = makeStyles({
	savebutton: {
		fontFamily: 'RobotoMono-SemiBold',
		backgroundColor: '#ac5978',
		'&:hover': {
			background: '#ac5978',
		},
	},
	updatebutton:{
		backgroundColor: '#407b88',
		height: '60px',
		fontFamily: 'RobotoMono-SemiBold',
		'&:hover': {
			background: '#407b88',
		},
	},
	cancelbutton:{
		backgroundColor: '#e57070',
		'&:hover': {
			background: '#e57070',
		},
	},
	handlebutton: {
		backgroundColor: '#4b6180',
		'&:hover': {
			background: '#4b6180',
		},
	},
	saveQueryButton: {
		backgroundColor: '#569d90',
		'&:hover': {
			background: '#569d90',
		},
	},
	resetQueryButton: {
		backgroundColor: '#5a6370',
		'&:hover': {
			background: '#5a6370',
		},
	}
})

const { REACT_APP_QUERY_NAME_PATTERN } = process.env


function SaveQuery({timeQuery, editing}) {
	const dispatch = useDispatch()
	const classes = usesTyles()
	const monitor = useSelector(state => state.monitor)
	const [msg, PopUpMessage] = HandleMessage()

	const [disabled, setDisabled] = useState(true)
	const [openSaveQuery, setOpenSaveQuery] = useState(false)

    const [queryName, setQueryName] = useState("")
	const [ifSameQueryName, setifSameQueryName] = useState(true)
    const [queryDescription, setQueryDescription] = useState("")
	const [infoUpdateDescription, setInfoUpdateDescription] = useState("");
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
	 * check active save button
	 */
	useEffect(() => {
		if(monitor.length > 0){
			setDisabled(false)
		}else{
			setDisabled(true)
		}
	}, [monitor, timeQuery])

	/*
	 * if editing query
	 */
	useEffect(() => {
		if(editing?.active){
			setQueryName(editing?.name)
			setQueryDescription(editing?.description)
		}
	}, [editing]);

	/*
	 * check the changes in queryName when editing
	 */
	const setValuesForEditing = (newValue) => {
		setQueryName(newValue)
		setifSameQueryName((newValue === editing.name))
	}

	/*
	 * test regular expressions
	 */
	const testRegex = (value, expression) => {
		const re = new RegExp(expression)
		return re.test(value)
	}

	/*
	 * handle on submit
	 */
	const onSubmit = () => {
		try {
			if(queryName === "" || queryName === undefined){
				PopUpMessage({type:'warning', message:'Name field cannot be empty'})
			}
			else if(!testRegex(queryName, REACT_APP_QUERY_NAME_PATTERN)){
				PopUpMessage({type:'warning', message:"name cannot have special characters other than '_-@.()'"})
			}
			else{
				backDropLoadOpen()
				fnSaveQuery()
			}
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * stop editing action
	 */
	const stopEditing = () => {
		dispatch(editingQuery({active: false}))
		setQueryName("")
		setQueryDescription("")
		setInfoUpdateDescription("")
	}

	/*
	 * reset name and description inputs if editing 
	 */
	const resetInputs = () => {
		setQueryName(editing?.name)
		setQueryDescription(editing?.description)
		setifSameQueryName(true)
	}
	/*
	 * reset query monitors
	 */
	// const resetMonitors = () => {
	// 	dispatch(handleSelectedElemets('addMultiple', null, editing?.monitors_, null))
	// }
	
	/*
	 * save query
	 */
	const fnSaveQuery = () => {
		const payload = createPayload()

		const fnAction = (editing?.active && ifSameQueryName) 
			? () => updateQuery(queryName, payload) 
			: () => insertQuery(payload);

		Promise.resolve( fnAction() )
		.then(() =>{
			if(editing?.active){
				if(ifSameQueryName && queryDescription !== editing.description){
					editing["description"] = queryDescription
					dispatch(editingQuery(editing))
				}
				setQueryDescription(editing.description) // input
				setInfoUpdateDescription((ifSameQueryName) ? queryDescription : editing.description) // info text
				setQueryName(editing.name)
				setifSameQueryName(true)
			}else{
				setQueryName("")
				setQueryDescription("")
			}
			handleCloseSaveQuery()
			PopUpMessage({type:'success', message:'Query save successfully!'})
		})
		.catch((error) =>{
			console.error(error)
			const error_message = (error?.response?.message) ? error.response.message : error.message
			PopUpMessage({type:'error', message:error_message})
		}).finally(() => {
			backDropLoadClose()
		})
	}

	/*
	 * buil monitor data list
	 */
	const buildList = () => {
		try {
			let list = []
			for (let i = 0; i < monitor.length; i++) {
				list.push({
					component: monitor[i]?.name,
					id: monitor[i]?.id,
					magnitude: monitor[i]?.magnitude,
					prefix: monitor[i]?.options?.prefix,
					unit: monitor[i]?.options?.unit
				});
			}
			setMonitorList(list)
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}


	/*
	 * separate monitor options 
	 */
	const confOptionsSeparator = (val) => {
		const options = val.options
		const unit  = (options.unit === null || options?.unit === "Default") ? undefined : options.unit
		const prefix = (options.prefix === null || options?.prefix === "Default") ? undefined : options.prefix
		const decimal = (options.decimal === null || options.decimal === "Default") ? undefined : options.decimal
		const pos = (options.pos === null || options.pos === "" || options.pos === undefined) ? undefined : "["+options.pos+"]"
		delete val.options.prefix
		delete val.options.unit
		delete val.options.decimal
		delete val.options.pos
		return {
			unit,
			prefix,
			decimal,
			pos,
			options
		}
	}

	/*
	 * divide monitors by type
	 */
	const getMonitorListSeparator = () => {
		try {
			let [monitorDescriptions, magnitudeDescriptions, states] = [[],[],[]]
			monitor.map(val => {
				let [id, conf] = ["", ""];
				const category = getCategory(val.type)
				if(category === "monitor")
				{
					id = val?.id
					conf = confOptionsSeparator(val)
					monitorDescriptions.push({id, ...conf})
				}
				else if(category=== "magnitud")
				{
					id = val?.id
					conf = confOptionsSeparator(val)
					magnitudeDescriptions.push({id, ...conf})
				}
				else if(category === "state")
				{
					id = val?.id
					conf = confOptionsSeparator(val)
					states.push({id, ...conf})
				}
			})
			return {monitorDescriptions, magnitudeDescriptions, states}
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * generate payload for query
	 */
	const createPayload = () => {
		const id = (editing?.id && ifSameQueryName) ? editing.id : undefined;
		const name = queryName
		const description = queryDescription
		const created_by = null
		const monitorList = getMonitorListSeparator()
		const sampling = timeQuery.sampling
		return {id, name, description, created_by, ...monitorList, sampling}
	}


    return(
		<>
			{
			(editing?.active) ? 
				<>
					<Button
						onClick={stopEditing}
						className={classes.cancelbutton}
						variant="contained"
						startIcon={<CancelPresentationIcon />}
					>
							Cancel
					</Button>
					<Button
						disabled={disabled}
						onClick={handleOpenSaveQuery}
						className={classes.updatebutton}
						variant="contained"
						startIcon={<SystemUpdateAltIcon />}
					>
							Update Current Query 
					</Button>
					{/* <Button
						onClick={() => { 
							resetMonitors()
						}}
						disabled={false}
						className={classes.resetQueryButton}
						variant="contained"
						startIcon={<RestartAltIcon />}
					>
							Reset
					</Button> */}
					{/* <div>
						Edit Mode: ACTIVE
					</div>
					<div className="save-query-editing-message">
						Now executing the query: <i>{editing?.name}</i> 
					</div>
					<div className="save-query-editing-message">
						Descirption: <i>{
						(editing.description === "") 
						? "No desciption provided" 
						: (infoUpdateDescription === "") 
						? editing.description
						: infoUpdateDescription  // if description was edited, shows the current description without doing another petition to the server
						}</i> 
					</div> */}
				</>
				:
				<Button
					onClick={handleOpenSaveQuery}
					className={classes.savebutton}
					variant="contained"
					startIcon={<ArchiveIcon />}
					disabled={disabled}
				>
					Save Actual Query
				</Button>
			}

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
						{
							(editing?.active) ? "Update Query" : "Save Actual Query"
						}
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
										onChange={(e) => {
											(editing?.active) 
											? setValuesForEditing(e.target.value)
											: setQueryName(e.target.value)
										}}
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
								<Grid item md={2.5} className="save-query-input-title-name">
									description
								</Grid>
								<Grid item md={8.4}>
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
																	{(value?.prefix === "Default") ? "--": value.prefix} 
																</p>
																<p className="sv-unit"> 
																	{(value?.unit === "Default") ? "--": value.unit}
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
						<Grid item xs={12} sm={12} md={12}>
							<Grid container spacing={0}>
								{
									(editing?.active) ? 
										(ifSameQueryName) ? "" : 
										<>
										<Grid item xs={12} md={12} className="save-query-title-warning">
											Name is the query Id if you change it you will add a new one
										</Grid>
										<Grid item md={12} className="save-query-saveButton-box">
										<Button
											size="small"
											className={classes.resetQueryButton}
											onClick={() => {
												resetInputs()
											}}
											startIcon={<RestartAltIcon />}
											variant="contained"
										>
											Reset Inputs
										</Button>
										</Grid>
										</>
									: ""
								}
								<Grid item md={12} className="save-query-saveButton-box">
									<LoadingButton
										size="small"
										className={classes.saveQueryButton}
										onClick={() => {
											onSubmit()
										}}
										loadingPosition="start"
										startIcon={<SaveIcon />}
										variant="contained"
									>
										{
											(editing?.active && ifSameQueryName) ? "Update" : "Save"
										}
									</LoadingButton>
								</Grid>
							</Grid>
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
