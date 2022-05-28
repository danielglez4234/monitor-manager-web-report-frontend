import React, {useState, useEffect} from 'react';
import {
	getAllQuerys,
	deleteQuery
} from '../../../../../services/services';
import { useDispatch } from 'react-redux';
import { editingQuery } from '../../../../../actions';
import { 
	DataGrid,
	GridToolbarContainer,
  	GridToolbarFilterButton,
  	GridToolbarDensitySelector,
	GridColumnMenuContainer, 
    GridFilterMenuItem,  
    SortGridMenuItems
 } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Box, Button,Popover, Typography,  IconButton, Dialog, DialogTitle, DialogActions } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';

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

function CustomToolbar() {
	return (
	  <GridToolbarContainer>
		{/* <GridToolbarColumnsButton /> */}
		<GridToolbarFilterButton />
		<GridToolbarDensitySelector />
	  </GridToolbarContainer>
	);
}

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


export default function QueryTable({openViewQuery, setEditingQuery}) {
	const dispatch = useDispatch()
	const [msg, handleMessage] = PopUpMessage()
	const [rows, setRows] = useState([])
	const [anchorEl, setAnchorEl] = useState(null)
	const [rowPopOverValue, setRowPopOverValue] = useState("")
	const [loadingQuerys, setLoadingQuerys] = useState(true)
	const [queryId, setQueryId] = useState(null)
	const [openConfirm, setOpenConfirm] = useState(false)

    const handleOpenConfirmDelete = (id) => {
		console.log("id", id)
		setQueryId(id)
		setOpenConfirm(true)
	}
    const handleCloseConfirmDelete = () => setOpenConfirm(false);

	/*
	 * show popover value on the cell 
	 */
	const handlePopoverOpen = (event) => {
		try {
			const field = event.currentTarget.dataset.field
			const id = Number(event.currentTarget.parentElement.dataset.id)
			const data = rows.find((r) => r.id === id)
			if(field === "name" || field === "description")
			{
				if(data[field].length > 17) // if greater than 17 characters aply tooltip
				{
					setRowPopOverValue(data[field])
					setAnchorEl(event.currentTarget)
				}
			}
		} catch (error) {
			console.error(error)
		}
	}
	const handlePopoverClose = () => {
		setAnchorEl(null)
	}
	const open = Boolean(anchorEl)

	/*
	 * get querys from server
	 */
	const getQueryFromServer = () => {
		setLoadingQuerys(true)
		Promise.resolve(getAllQuerys())
		.then((res) => {
			console.log("res", res)
			if(res.length > 0){
				const fillrow = res.map(val => createRows(val))
				setRows(fillrow)
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
			getQueryFromServer()
			console.log("borrado correctamente")
		})
		.catch((error) => {
			console.error(error)
			showErrorMessage("Error obtaining querys on the server.")
		})
		.finally(() => {
			setLoadingQuerys(false)
		})
	}

	/*
	 * start editing query
	 */
	const handleEditQuery = (query) => {
		console.log("hola?", query)
		dispatch(editingQuery({active: true, ...query.row}))
		// TODO: traer el set del open para cerralo
		// setOpenViewQuery(false)
	}

	/*
	 * get cell row value id
	 */
	const getQueryId = (val) => {
		if(val?.row?.name){
			return val.row.name
		}
		else{
			showErrorMessage("name is undefined")
		}
	}
	
	/*
	 * set action iconButtons
	 */
	const loadButton = (cellValues) => {
		return (
			<IconButton 
				color="primary" 
				aria-label="load"
				onClick={(event) => {
					handleEditQuery(cellValues);
				}}
			>
				<UploadIcon className="rotate90"/>
			  </IconButton>
		  );
	}
	const deleteButton = (cellValues) => {
		return (
			<IconButton 
				color="error" 
				aria-label="delete"
				onClick={(event) => {
					handleOpenConfirmDelete(getQueryId(cellValues))
				}}
			>
				<DeleteIcon />
			  </IconButton>
		  );
	}
	/*
	 * create table data
	 */
	const createTableHeads = (field, type, width, sortable, hide, disableColumnMenu, actionCell, cellType) => {
		try {
			const renderCell = (actionCell) ? {
				renderCell: (cellValues) => {
					if(cellType === "load")
						return loadButton(cellValues)
					else if(cellType === "delete")
						return deleteButton(cellValues)
				}
			} : undefined;
			return {
					field,
					type,
					width,
					hide,
					sortable,
					hideable: false,
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
			return { 
				id,
				name,
				description,
				created_by,
				creation_time,
				update_time,
			}
		} catch (error) {
			console.error(error)
		}
	}

	/*
	 * columns heads
	 */
	const columnHeads = [
		createTableHeads("monitorInfo",   null,     null,true,  true,  false, false, null),
		createTableHeads("id", 			  "number", 70,  true,  false, false, false, null),
		createTableHeads("name", 		  "text", 	150, true,  false, false, false, null),
		createTableHeads("description",   "text", 	150, true,  false, false, false, null),
		createTableHeads("created_by", 	  "text", 	115, true,  false, false, false, null),
		createTableHeads("creation_time", "date", 	160, true,  false, false, false, null),
		createTableHeads("update_time",   "date", 	160, true,  false, false, false, null),
		createTableHeads("load", 		  null, 	60,  false, false, true,  true,  "load"),
		createTableHeads("delete", 		  null, 	60,  false, false, true,  true,  "delete")
	]

	/*
	 * search when the modal opens
	 */
	useEffect(() => {
		if(openViewQuery){
			getQueryFromServer()
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
			open={openConfirm}
			onClose={handleCloseConfirmDelete}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{`Are you sure you want to delete this query?`}
			</DialogTitle>
			<DialogActions>
			<Button onClick={handleCloseConfirmDelete}>Cancel</Button>
			<Button onClick={e => {deleteQueryFromServer(queryId); handleCloseConfirmDelete();}} autoFocus color="error">
				Delete
			</Button>
			</DialogActions>
		</Dialog>
		<div style={{ height: '100%', width: '100%' }}>
			<DataGrid
				className="store-querys-table"
				components={{
					ColumnMenu: CustomColumnMenu,
					NoRowsOverlay: CustomNoRowsOverlay,
					Toolbar: CustomToolbar,
				}}
				componentsProps={{
					cell: {
					  onMouseEnter: handlePopoverOpen,
					  onMouseLeave: handlePopoverClose,
					},
				  }}
				loading={loadingQuerys}
				rows={(rows.length > 0) ? rows : []} //TODO: sin esta comprobocación de momento el icono de "no Rows" no salta.
				columns={columnHeads}
			/>
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
		</div>
		</>
	);
}