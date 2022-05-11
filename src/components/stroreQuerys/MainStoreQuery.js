// TODO: REFACTOR: quitar el MainStoreQuery y convertir en el saveQuery (eliminar el main) y sacar dos componentes distintos

import React, { useEffect, useState } from 'react';
import * as $ 						from 'jquery'
import { useSelector } 				from 'react-redux';


import {makeStyles}					from '@material-ui/core';
import { 
	Stack,
	Button,
	IconButton
}from '@mui/material';

import SearchIcon                   from '@mui/icons-material/Search';
import PreviewIcon                  from '@mui/icons-material/Preview';
import EditIcon                     from '@mui/icons-material/Edit';
import DeleteForeverIcon            from '@mui/icons-material/DeleteForever';
import ArchiveIcon 					from '@mui/icons-material/Archive';
import InventoryIcon 				from '@mui/icons-material/Inventory';
import SaveQuery 					from './SaveQuery';
import PopUpMessage                 from '../../components/handleErrors/PopUpMessage';


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
	}
})

function MainStoreQuery({convertToUnix, constructURL, searchForm}) {
	const classes = usesTyles()
	const [msg, handleMessage] = PopUpMessage()
	
	const [disabled, setDisabled] = useState(true)
	const [openSaveQuery, setOpenSaveQuery] = useState(false)
	const [searchData, setSearchData] = useState(searchForm)

	const handleOpenSaveQuery = () => {
		setOpenSaveQuery(true)
	}
	
	useEffect(() => {
		setSearchData(searchForm)
	}, [searchForm]);

	const handleCloseSaveQuery = () => setOpenSaveQuery(false)
	
	
	const monitor = useSelector(state => state.monitor)
	useEffect(() => {
		const unixBeginDate = convertToUnix(searchData.beginDate)
		const unixEndDate = convertToUnix(searchData.endDate)
		if(monitor.length > 0 && searchData.beginDate !== "" && searchData.endDate !== "" && unixBeginDate < unixEndDate){
			setDisabled(false)
		}else{
			setDisabled(true)
		}
	}, [monitor, searchData])


    return(
		<div className="store-query-section">
			<div className="sample-header-store-query">

			<Stack direction="column" spacing={1}>
				Store Querys
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
				<Button
					sx={{backgroundColor: '#4b6180', height: 60}} 
					className={classes.handlebutton}
					variant="contained"  
					startIcon={<InventoryIcon />}
				>
					View Store Querys
				</Button>
			</Stack>

			{/*
				Modals
			*/}
			<SaveQuery
				open={openSaveQuery}
				handleClose={handleCloseSaveQuery}
				monitorsSelected={monitor}
				// TODO refactor begin an end date on state change value
				// beginDate={beginDate}
				// endDate={endDate}
				searchForm={searchData}
				constructURL={constructURL}
			/>

			</div>
		</div>
    );
}
export default MainStoreQuery;
