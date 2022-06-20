import React, { useState } from 'react';
import {makeStyles}					from '@material-ui/core';
import { 
    Modal,
    Box,
    Grid,
	Button,
} from '@mui/material';

import InventoryIcon				from '@mui/icons-material/Inventory';

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


function ViewHandleQuery() {
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
				View Store Queries
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
							View Store Queries
						</Grid>

						{/* <Grid container spacing={0}> */}
							<Grid item xs={12} sm={12} md={12} className="store-query-title-table-box">
								{
									<QueryTable
										openViewQuery={openViewQuery}
										handleCloseSaveQuery={handleCloseSaveQuery}
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
