// TODO: REFACTOR: 
// export only one action that references all the types


export const handleSelectedElemets = (type, id, data, options) => {
	return{
		type: type,
		id: id,
		data: data,
		options: options,
	}
}

export const hadleSearch = (perform, begin_date, end_date, sampling, searchedMonitors) => {
	return{
		type: 'executeSeacrh',
		perform: perform,
		begin_date: begin_date,
		end_date: end_date,
		sampling: sampling,
		searchedMonitors: searchedMonitors
	}
}

export const getMonitorMagnitude = (category, id, type, iDisplayStart, iDisplayLength) => {
	return{
		type: 'getMonitorMagnitdeForUrl',
		category: category,
		idMonitorMagnitude: id,
		monitorMagnitudtype: type,
		iDisplayStart: iDisplayStart,
		iDisplayLength: iDisplayLength
	}
}


export const setloadingButton = ( activeOrDisabled ) => {
	return{
		type: 'setloadingButton',
		activeOrDisabled: activeOrDisabled
	}
}


export const setSamples = ( responseData, sampling_period ) => {
	return {
		type: 'setSamples',
		responseData: responseData,
		sampling_period: sampling_period
	}
}


export const getUrl = ( url ) => {
	return {
		type: 'getUrl',
		url: url
	}
}

export const reloadGrafic = ( reload ) => {
	return {
		type: 'reload',
		reload: reload
	}
}


export const loadGraphic = ( loading ) => {
	return {
		type: 'loadgraphic',
		loading: loading
	}
}


export const setTotalResponseData = ( totalArrays, totalRecords, totalPerPage) => {
	return {
		type: 'setTotalResponseData',
		totalArrays: totalArrays,
		totalRecords: totalRecords,
		totalPerPage: totalPerPage
	}
}


export const setActualPage = ( active, displayLength, actualPage, totalPages ) => {
	return {
		type: 'setActualPage',
		active: active,
		displayLength: displayLength,
		actualPage: actualPage,
		totalPages: totalPages
	}
}

export const editingQuery = (data) => {
	return {
		type: 'editingQuery',
		data: data
	}
}