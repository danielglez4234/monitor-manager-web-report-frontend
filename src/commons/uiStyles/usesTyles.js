import { makeStyles } from '@material-ui/core';

export const usesTyles = makeStyles({
	
	save_actual_query_button: {
		fontFamily: 'RobotoMono-SemiBold',
		backgroundColor: '#ac5978',
		'&:hover': {
			background: '#ac5978',
		},
	},

	view_store_queries_button: {
		backgroundColor: '#4b6180', 
		height: 60,
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
	 * select monitor array index section
	 */
	index_button_contained: {
		backgroundColor: '#fff',
		color: 'black',
		'&:hover':{
			backgroundColor: '#fff99'
		}
	},
	
	index_button_outlined: {
		backgroundColor: 'transparent',
		color: '#fff',
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