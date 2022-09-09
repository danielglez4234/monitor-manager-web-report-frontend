import { makeStyles } from '@material-ui/core';

const colors = {
	white: '#fff',
	balck: '#333',
	light_blue: '#58a0b0',
	light_green: '#62bfa5',
	darker_blue: '#4b6180',
	deep_blue_1: '#407b88',
	deep_blue_2: '#407b99',
	darker_pink: '#ac5978'
}


export const usesTyles = makeStyles({
	/*
	 * COLORS
	 */
	COLORS: colors,
	
	/*
	 * Perform Queries Buttons
	 */
	perfrom_query_button_search:{
		backgroundColor: colors.light_green,
	 	height: '60px',
		width: '100%',
  		fontWeight: 'bold',
		'&:hover': {
			background: colors.light_green,
		},
		'&.MuiLoadingButton-loadingIndicator': {
			left: 'revert',
  			marginLeft: '-150px',
  			color: colors.white,
		}
	},

	/*
	 * General Options Section
	 */
	apply_general_options_button: {
		backgroundColor: colors.deep_blue_1,
		height: '25px',
		marginBottom: '5px',
		fontFamily: 'RobotoMono-Bold',
		'&:hover': {
			background: colors.deep_blue_2,
		},
	},
	
	/*
	 * Store Queries Section
	 */
	save_actual_query_button: {
		fontFamily: 'RobotoMono-SemiBold',
		backgroundColor: colors.darker_pink,
		'&:hover': {
			background: colors.darker_pink,
		},
	},

	view_store_queries_button: {
		fontFamily: 'RobotoMono-SemiBold',
		backgroundColor: colors.darker_blue, 
		// height: 60,
		'&:hover': {
			background: colors.darker_blue,
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
		backgroundColor: colors.deep_blue_1,
		height: '60px',
		fontFamily: 'RobotoMono-SemiBold',
		'&:hover': {
			background: colors.deep_blue_1,
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
		backgroundColor: colors.white,
		color: 'black',
		'&:hover':{
			backgroundColor: colors.white,
		}
	},
	
	index_button_outlined: {
		backgroundColor: 'transparent',
		color: colors.white,
		border: '1px solid' + colors.white,
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