import React, { useEffect, useState } from 'react';

import {makeStyles}					from '@material-ui/core';
import { 
    Modal,
    Box,
    Grid,
	Stack,
	Button,
    Typography,
} from '@mui/material';

import ArchiveIcon 					from '@mui/icons-material/Archive';
import SaveIcon                     from '@mui/icons-material/Save';
import InventoryIcon				from '@mui/icons-material/Inventory';
import LoadingButton                from '@mui/lab/LoadingButton';

import QueryTable 					from './QueryTable';


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


function ViewHandleQuery({constructURL}) {
	const classes = usesTyles()
	const [openViewQuery, setOpenViewQuery] = useState(false)

	const handleOpenViewQuery = () => setOpenViewQuery(true)
	const handleCloseSaveQuery = () => setOpenViewQuery(false)


    return(
		<>
			<Button
				sx={{backgroundColor: '#4b6180', height: 60}} 
				className={classes.handlebutton}
				variant="contained"  
				startIcon={<InventoryIcon />}
				onClick={() => {handleOpenViewQuery()}}
			>
				View Store Querys
			</Button>

		{/*
			Modals
		*/}

			<Modal
				open={openViewQuery}
				onClose={handleCloseSaveQuery}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="view-query-modal">
					<Grid container spacing={0} className="view-query-modal-cont">
						<Grid item xs={12} sm={12} md={12} className="store-query-title">
							View Store Querys
						</Grid>

						{/* <Grid container spacing={0}> */}
							<Grid item xs={12} sm={12} md={12} className="store-query-title-table-box">
								{
									<QueryTable
										openViewQuery={openViewQuery}
									/>
								}
							</Grid>
						{/* </Grid> */}
					</Grid>
				</Box>
			</Modal>
	</>

    );
}
export default ViewHandleQuery;
