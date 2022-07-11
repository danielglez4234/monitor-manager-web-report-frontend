import React, {useState, useEffect} from 'react';
import {
	getAllQuerys,
	deleteQuery
} from '../../../../../services/services';
import { useDispatch } from 'react-redux';
import { editingQuery, handleSelectedElemets } from '../../../../../actions';
import { fnIsArray } from '../../../../standarFunctions'; // TODO: REFACTOR: temporal hotfix
import { 
	DataGrid,
	GridToolbarContainer,
  	GridToolbarFilterButton,
  	GridToolbarDensitySelector,
	GridColumnMenuContainer, 
    GridFilterMenuItem,  
    SortGridMenuItems,
	gridPageCountSelector,
  	gridPageSelector,
  	useGridApiContext,
  	useGridSelector
 } from '@mui/x-data-grid';
 import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { 
	Box, 
	Button,
	Popover, 
	Typography,  
	IconButton, 
	Dialog, 
	DialogTitle, 
	DialogActions, 
	Tooltip,
	Checkbox,
	Modal
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import PreviewIcon from '@mui/icons-material/Preview';
import { BookmarkBorder, Bookmark } from '@mui/icons-material';

import HEADS from './columnsHeads'
import PopUpMessage from '../../../../handleErrors/PopUpMessage';

const StyledGridOverlay = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	'& .ant-empty-img-1': {
		fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
	},
	'& .ant-empty-img-2': {
		fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
	},
	'& .ant-empty-img-3': {
		fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
	},
	'& .ant-empty-img-4': {
		fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
	},
	'& .ant-empty-img-5': {
		fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
		fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
	},
}));



/*
 * CustomToolbar: up button section
 * filter, density
 */
function CustomToolbar() {
	return (
	  <GridToolbarContainer>
		{/* <GridToolbarColumnsButton /> */}
		<GridToolbarFilterButton />
		<GridToolbarDensitySelector />
	  </GridToolbarContainer>
	);
}

/*
 * CustomColumnMenu: column side button
 * sort columns, filter columns
 */
function CustomColumnMenu(props){
    const { hideMenu, currentColumn } = props;
    return (
        <GridColumnMenuContainer
            hideMenu={hideMenu}
            currentColumn={currentColumn}
        >
            <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
            <GridFilterMenuItem onClick={hideMenu} column={currentColumn} />
        </GridColumnMenuContainer>
    );
};

/*
 * CustomNoRowsOverlay: icon that shows when there is no data
 */
function CustomNoRowsOverlay() {
	return (
		<StyledGridOverlay>
		<svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
			<g fill="none" fillRule="evenodd">
				<g transform="translate(24 31.67)">
					<ellipse className="ant-empty-img-5" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
					<path
						className="ant-empty-img-1"
						d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
					/>
					<path
						className="ant-empty-img-2"
						d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
					/>
					<path
						className="ant-empty-img-3"
						d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
					/>
				</g>
				<path
					className="ant-empty-img-3"
					d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
				/>
				<g className="ant-empty-img-4" transform="translate(149.65 15.383)">
					<ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
					<path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
				</g>
			</g>
		</svg>
		<Box sx={{ mt: 1 }}>No Rows</Box>
		</StyledGridOverlay>
	);
}

/*
 * CustomPagination: bottom pagination
 */
function CustomPagination() {
	const apiRef = useGridApiContext();
	const page = useGridSelector(apiRef, gridPageSelector);
	const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
	return (
	  <Pagination
		color="primary"
		count={pageCount}
		page={page + 1}
		onChange={(event, value) => apiRef.current.setPage(value - 1)}
	  />
	);
  }


export default function QueryTable({openViewQuery, handleCloseSaveQuery}) {
	const dispatch = useDispatch()
	const [msg, handleMessage] = PopUpMessage()
	const [rows, setRows] = useState([])
	const [anchorEl, setAnchorEl] = useState(null)
	const [rowPopOverValue, setRowPopOverValue] = useState("")
	const [loadingQuerys, setLoadingQuerys] = useState(true)
	const [queryId, setQueryId] = useState(null)
	const [openConfirm, setOpenConfirm] = useState(false)
	const [openPreviewModal, setOpenPreviewModal] = useState(false);
	const [monitorsListPreview, setMonitorsListPreview] = useState([]);
	// const [selectionModel, setSelectionModel] = useState([]);
	// const [checked, setChecked] = useState(false); // TODO: => change to array

	/*
	 * Confirm before Delete
	 */
    const handleOpenConfirmDelete = (id) => {
		setQueryId(id)
		setOpenConfirm(true)
	}
    const handleCloseConfirmDelete = () => setOpenConfirm(false);

	/*
	 * calculate text width in the DOM
	 */
	const getTextWidth = (text, font) => {
		const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"))
		const context = canvas.getContext("2d")
		context.font = font
		const metrics = context.measureText(text)
		return Math.trunc(metrics.width)
	}

	/*
	 * show popover value on the cell 
	 */
	const handlePopoverOpen = (event) => {
		try {
			const field = event.currentTarget.dataset.field
			const id = Number(event.currentTarget.parentElement.dataset.id)
			const data = rows.find((r) => r.id === id)
			if(field === "name" || field === "description" || field === "creation_time" || field === "update_time")
			{
				const textWidth = getTextWidth(data[field], "400 0.875rem Roboto")
				if(textWidth > event.currentTarget.clientWidth) // if greater than textWidth aply tooltip
				{
					setRowPopOverValue(data[field])
					setAnchorEl(event.currentTarget)
				}
			}
		} catch (error) {
			console.error(error)
		}
	}
	const handlePopoverClose = () => {setAnchorEl(null)}
	const open = Boolean(anchorEl)

	/*
	 * get querys from server
	 */
	const loadQuerys = () => {
		setLoadingQuerys(true)
		Promise.resolve(getAllQuerys())
		.then((res) => {
			if(res.length > 0){
				const fillrow = res.map(val => createRows(val))
				setRows(fillrow)
			}else{
				setRows([])
			}
		})
		.catch((error) => {
			console.error(error)
			setRows([])
			showErrorMessage("Error obtaining querys on the server.")
		})
		.finally(() => {
			setLoadingQuerys(false)
		})
	}

	/*
	 * delete query
	 */
	const deleteQueryFromServer = (id) => {
		setLoadingQuerys(true)
		Promise.resolve(deleteQuery(id))
		.then((res) => {
			loadQuerys()
			console.log("Query Deleted Correctly!!")
		})
		.catch((error) => {
			console.error(error)
			showErrorMessage("Error deleting the query on the server")
		})
		.finally(() => {
			setLoadingQuerys(false)
		})
	}

	/*
	 * Arrange monitors from storedquery
	 */
	const getArrageMonitorList = (val) => {
		const monitorList = []
		val.map(item => {
			const component_id = item.id_monitor_component.id
			const name = item.id_monitor_component.name
			const options = item.options
			let monitorData
			if(item?.id_magnitude_description){
				monitorData = item.id_magnitude_description
				monitorList.push({component_id, name, ...monitorData, options})
			}
			else if(item?.id_monitor_description){
				monitorData = item.id_monitor_description
				item.options["prefix"] 	= item.prefix
				item.options["unit"] 	= item.unit
				item.options["decimal"] = item.decimal
				item.options["pos"] = (fnIsArray(item.id_monitor_description.type)) ? item.pos.slice(1, -1) : ""
				monitorList.push({component_id, name, ...monitorData, options})
			}
			else{
				monitorList.push({id: component_id, name, magnitude: "STATE", type: "state", options})
			}
		})
		return monitorList
	}

	/*
	 * start editing query
	 */
	const handleLoadQuery = (query, edit) => {
		const monitors_ = getArrageMonitorList(query.row.monitorInfo)
		delete query.row["monitorInfo"]
		// if(concatMonitors){
			// dispatch(handleSelectedElemets('concatMultiple', null, monitors_, null))
		// }
		// else{
			dispatch(handleSelectedElemets('addMultiple', null, monitors_, null))
			handleCloseSaveQuery()
			if(edit) dispatch(editingQuery({active: true, ...query.row}))
		// }
	}

	const previewQuery = (monitorList) => {
		console.log("monitorList", monitorList)
		setMonitorsListPreview(monitorList)
		setOpenPreviewModal(true)
	}
	const closePreviewQuery = () => {
		setMonitorsListPreview([])
		setOpenPreviewModal(false)
	}
	/*
	 * get cell row value id
	 */
	const getQueryId = (val) => {
		if(val?.row?.name)
			return val.row.name
		else
			showErrorMessage("name is undefined")
	}

	const getMonitorInfo = (val) => {
		if(val?.row?.monitorInfo)
			if(val.row.monitorInfo.length > 0)
				return val.row.monitorInfo
			else
				showErrorMessage("monitorInfo is empty")
		else
			showErrorMessage("monitorInfo is undefined")
	}

	/*
	 * save query to local storage
	 */
	// useEffect(() => {
		
	// }, [checked]);
	// const saveToLocalStorage = (val) => {
	// 	localStorage.setItem("favorites", val)
		
	// }
	/*
	 * preview monitors button
	 */
	const previewButton = (cellValues) => {
		return (
			<Tooltip title="Preview Monitors">
				<IconButton
					color="primary"
					aria-label="load"
					onClick={(event) => {
						previewQuery(getMonitorInfo(cellValues))
					}}
				>
					<PreviewIcon/>
				</IconButton>
			</Tooltip>
		);
	}
	
	/*
	 * set action iconButtons
	 */
	const actionsButtons = (cellValues) => {
		return (
			<>
			<Tooltip title="Load">
				<IconButton
					color="primary"
					aria-label="load"
					onClick={(event) => {
						handleLoadQuery(cellValues);
					}}
				>
					<UploadIcon className="rotate90 blue-iconcolor"/>
				</IconButton>
			</Tooltip>
			<Tooltip title="Edit">
				<IconButton
					color="secondary"
					aria-label="load"
					onClick={(event) => {
						handleLoadQuery(cellValues, true);
					}}
				>
					<EditIcon className="gray-iconcolor" />
				</IconButton>
			</Tooltip>
			<Tooltip title="Delete">
				<IconButton
					color="error"
					aria-label="delete"
					onClick={(event) => {
						handleOpenConfirmDelete(getQueryId(cellValues))
					}}
				>
					<DeleteIcon className="red-iconcolor" />
				</IconButton>
			</Tooltip>
			{/* <Tooltip title="Add To Favorites">
				<Checkbox 
					// checked={true}
					icon={<BookmarkBorder />}
					checkedIcon={<Bookmark />} 
				/>
			</Tooltip> */}
			</>
		);
	}

	const getButtonsCell = (type, ) => {
		return {
			renderCell: (cellValues) => {
				if(type === "preview")
					return previewButton(cellValues)
				else
					return actionsButtons(cellValues)
			}
		}
	}

	/*
	 * create table data
	 */
	const createTableHeads = ({field, type, width, sortable, filterable, hide, disableColumnMenu, actionCell, actionCellType}) => {
		try {
			const flex = (actionCell) ? null : 1
			const hideable = false
			const headerClassName = 'store-query-table-headers'
			const renderCell = (actionCell) ?  getButtonsCell(actionCellType) : undefined;
			return {
					headerClassName,
					hideable,
					flex,
					field,
					type,
					width,
					sortable,
					filterable,
					hide,
					disableColumnMenu,
					...renderCell
				}
		} catch (error) {
			console.error(error)
		}
	}
	const createRows = (rows) => {
		try {
			const id = rows?.id
			const name = rows?.name
			const description = rows?.description
			const created_by = rows?.created_by
			const creation_time = rows?.creation_time
			const update_time = rows?.update_time
			const sampling = rows?.sampling
			const monitorInfo = [...rows?.magnitudeDescriptions, ...rows?.monitorDescriptions, ...rows?.states]
			return {
				id,
				name,
				description,
				created_by,
				creation_time,
				update_time,
				sampling,
				monitorInfo 
			}
		} catch (error) {
			console.error(error)
		}
	}

	/*
	 * columns heads
	 */
	const columnHeads = []
	HEADS.map((val) => {columnHeads.push(createTableHeads(val))})

	/*
	 * load when the modal opens
	 */
	useEffect(() => {
		if(openViewQuery){
			loadQuerys()
		}
	}, [openViewQuery])
	
	/*
	 * Show Warning message snackbar
	 */
	const showErrorMessage = (message) => { 
		handleMessage({
			message: message,
			type: "error",
			persist: true,
			preventDuplicate: true
		})
	}

	return (
		<>
		<Dialog
			className="store-query-confirm-delete"
			open={openConfirm}
			onClose={handleCloseConfirmDelete}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle className="store-query-confirm-delete-text">
				{`Are you sure you want to delete this query?`}
			</DialogTitle>
			<DialogActions>
				<Button onClick={handleCloseConfirmDelete}>Cancel</Button>
				<Button onClick={e => {deleteQueryFromServer(queryId); handleCloseConfirmDelete();}} autoFocus color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>

		<Modal
			// open={openPreviewModal}
			open={false}
			onClose={closePreviewQuery}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
		<Box>
			{
				(monitorsListPreview.length > 0) ? 
					monitorsListPreview.map((val) => {
						return (
							<Typography id="modal-modal-title" variant="h6" component="h2">
								{val.magnitude}
							</Typography>
						);
					})
				: ""
			}
			<Typography id="modal-modal-title" variant="h6" component="h2">
				Text in a modal
			</Typography>
			<Typography id="modal-modal-description" sx={{ mt: 2 }}>
				Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
			</Typography>
		</Box>
		</Modal>

		<Box
			sx={{
				height: '100%',
				width: '100%',
				'& .store-query-table-headers': {
					fontFamily: 'RobotoMono-Regular',
					fontSize: 14,
				},
			}}
			>
			<DataGrid
				// checkboxSelection
				// onSelectionModelChange={(newSelectionModel) => {
				// 	setSelectionModel(newSelectionModel);
				// }}
				// selectionModel={selectionModel}
				pagination
				pageSize={11}
				className="store-querys-table"
				components={{
					ColumnMenu: CustomColumnMenu,
					NoRowsOverlay: CustomNoRowsOverlay,
					Toolbar: CustomToolbar,
					Pagination: CustomPagination
				}}
				componentsProps={{
					cell: {
					  onMouseEnter: handlePopoverOpen,
					  onMouseLeave: handlePopoverClose,
					},
				  }}
				loading={loadingQuerys}
				rows={(rows.length > 0) ? rows : []}
				columns={columnHeads}
			/>
		</Box>
			<Popover
				sx={{
					pointerEvents: 'none',
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<Typography sx={{ p: 1 }}>{`${rowPopOverValue}`}</Typography>
			</Popover>
		</>
	);
}