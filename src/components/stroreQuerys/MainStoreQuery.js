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

function MainStoreQuery() {
	// //setup before functions
	// var typingTimer;                //timer identifier
	// var doneTypingInterval = 5000;  //time in ms, 5 seconds for example
	// var $input = $('#myInput');

	// //on keyup, start the countdown
	// $input.on('keyup', function () {
	// 	clearTimeout(typingTimer);
	// 	typingTimer = setTimeout(doneTyping, doneTypingInterval);
	// });

	// //on keydown, clear the countdown 
	// $input.on('keydown', function () {
	// 	clearTimeout(typingTimer);
	// });

	// //user is "finished typing," do something
	// function doneTyping () {
	// 	//do something
	// }

	const classes = usesTyles()
	const [msg, handleMessage] = PopUpMessage()
	
	const [disabled, setDisabled] = useState(true)
	const [openSaveQuery, setOpenSaveQuery] = useState(false)
	const [beginDate, setBeginDate] = useState("")
	const [endDate, setEndDate] = useState("")

	const handleOpenSaveQuery = () => {
		setOpenSaveQuery(true)
		setBeginDate($('#beginDate').val())
		setEndDate($('#endDate').val())
	}
	const handleCloseSaveQuery = () => setOpenSaveQuery(false)
	
	
	const monitor = useSelector(state => state.monitor)
	useEffect(() => {setDisabled((monitor.length > 0) ? false : true)}, [monitor])


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
					disabled={false}
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
				beginDate={beginDate}
				endDate={endDate}
			/>

			</div>
		</div>
    );
}
export default MainStoreQuery;
