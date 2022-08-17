import { makeStyles } from '@material-ui/core';

export const usesTyles = makeStyles({
	/*
	 * COLORS
	 */
	COLORS:{
		white:{ color: '#fff' },
		balck:{ color: '#333' },
		light_green:{ color: '#62bfa5' },
		light_blue:{ color: '#58a0b0'},
		darker_blue:{ color: '#4b6180'},
	},
	
	/*
	 * Perform Queries Buttons
	 */
	perfrom_query_button_search:{
		backgroundColor: '#62bfa5',
	 	height: '60px',
		width: '100%',
  		fontWeight: 'bold',
		'&:hover': {
			background: '#62bfa5',
		},
		'&.MuiLoadingButton-loadingIndicator': {
			left: 'revert',
  			marginLeft: '-150px',
  			color: 'white',
		}
	},

	/*
	 * General Options Section
	 */
	apply_general_options_button: {
		backgroundColor: '#407b88',
		height: '25px',
		marginBottom: '5px',
		fontFamily: 'RobotoMono-Bold',
		'&:hover': {
			background: '#407b99',
		},
	},
	
	/*
	 * Store Queries Section
	 */
	save_actual_query_button: {
		fontFamily: 'RobotoMono-SemiBold',
		backgroundColor: '#ac5978',
		'&:hover': {
			background: '#ac5978',
		},
	},

	view_store_queries_button: {
		fontFamily: 'RobotoMono-SemiBold',
		backgroundColor: '#4b6180', 
		// height: 60,
		'&:hover': {
			background: '#4b6180',
		},
	},
	
	/*
	 *  Save query Modal
	 */
	save_query_box:{
		textAlign: "end",
		margin: "6px 10px 10px 0px",
	},
	
	update_query_button:{
		backgroundColor: '#407b88',
		height: '60px',
		fontFamily: 'RobotoMono-SemiBold',
		'&:hover': {
			background: '#407b88',
		},
	},
	
	cancel_query_button:{
		backgroundColor: '#e57070',
		'&:hover': {
			background: '#e57070',
		},
	},

	save_query_button: {
		backgroundColor: '#569d90',
		'&:hover': {
			background: '#569d90',
		},
	},
	reset_query_button: {
		backgroundColor: '#5a6370',
		'&:hover': {
			background: '#5a6370',
		},
	},

	/*
	 * View Query table
	 */
	grid_Toolbar_filter_button:{
		backgroundColor: "#555e6a", 
		padding: "5px 16px", 
		marginLeft: "5px", 
		'&:hover': {
			background: 'rgb(51, 58, 68)'
		}
	},
	grid_Toolbar_sensity_selector:{
		backgroundColor: "#67b9cc", 
		padding: "6px 16px", 
		marginLeft: "5px", 
		'&:hover': {
			background: '#5ea9bb'
		}
	},
	grid_Toolbar_concat_button:{
		backgroundColor: "#5fb2bb", 
		marginLeft: "5px", 
		'&:hover': {
			background: '#53989f'
		}
	},
	grid_Toolbar_delete_selected:{
		backgroundColor: "#df3f91", 
		marginLeft: "5px", 
		'&:hover': {
			background: '#c13b80'
		}
	},


	view_store_query_modal_title:{
		backgroundColor: "rgb(40, 46, 57)", 
		borderBottom: "3px solid #85e1d0", 
		padding: "3px 0px 3px 15px"
	},

	/*
	 * select monitor array index section
	 */
	index_button_contained: {
		backgroundColor: '#fff',
		color: 'black',
		'&:hover':{
			backgroundColor: '#fff',
		}
	},
	
	index_button_outlined: {
		backgroundColor: 'transparent',
		color: '#fff',
		border: '1px solid white',
		'&:hover':{
			border: '1px solid gray'
		}
	},

	/*
	 * montor settings
	 */
	monitor_settings_grid: {
		backgroundColor: "rgb(40, 46, 57)", 
		borderBottom: "3px solid #85e1d0", 
		padding: "3px 0px 3px 15px"
	},


	/*
	 * backDrop
	 */
	backDropLoad: {
		 color: '#569d90',
	},



})