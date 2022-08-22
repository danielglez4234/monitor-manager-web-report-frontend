import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import $ from "jquery";
import {
  handleSelectedElemets,
}
from '../../../../actions';
import Fuse from 'fuse.js';
import { 
	Stack, 
	Skeleton, 
	IconButton, 
	Divider,
	Tooltip
}  from '@mui/material';
import { LtTooltip } from '../../../../commons/uiStyles';
import { 
  Search,
  SearchIconWrapper,
  StyledInputBase 
} from '../../../../commons/uiStyles';
import SearchIcon      from '@mui/icons-material/Search';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import BookmarkIcon	   from '@mui/icons-material/Bookmark';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HelpIcon from '@mui/icons-material/Help';
import FavoriteElement from './FavoriteElement'

import { arrageMonitors } from '../manageMonitorData';
import HandleMessage    from '../../../handleErrors/HandleMessage';



const skeleton            = <div className="sample-items-favorites">
								<Skeleton className="skeleton-favorites" variant="rectangular" width={235} height={30} />
								<Skeleton className="skeleton-favorites" variant="rectangular" width={235} height={30} />
								<Skeleton className="skeleton-favorites" variant="rectangular" width={235} height={30} />
								<Skeleton className="skeleton-favorites" variant="rectangular" width={235} height={30} />
								<Skeleton className="skeleton-favorites" variant="rectangular" width={235} height={30} />
							</div>;
const noResultFound       = <div className="noComponentSelected-box">
								<BookmarkIcon className="noComponentSelected-icon" />
								<p className="noComponentSelected-title">No Results Found</p>
							</div>;

const sectionHelperText = "In this section you will be able to visualize the elements marked in the table of stored queries. Currently localStorage is being used, try not to delete it to avoid losing the queries."							


/*
 * localStorage => 
 * setItem() :
 * getItem() :
 * removeItem() :
 * clear() :
 */

function FavoriteQueries({addItem, updatingQuery}) {
	const dispatch = useDispatch()
	const [msg, PopUpMessage] = HandleMessage()
	const [loadingFavorites, setLoadingFavorites] = useState(true)
	const [favorites, setFavorites] = useState([])
	const [resultQueryFavorite, setResultQueryFavorite] = useState([])
	const [sortToggle, setSortToggle] = useState(false);

	/*
	 * get local storage data
	 */
	const getLocalStorage = async () => {
		try {
			return await JSON.parse(localStorage.getItem('favorites'))
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * set local storage to favorites
	 */
	const setLocalStorage = (data) => {
		try {
			localStorage.setItem('favorites', JSON.stringify(data))
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * load favorites querys
	 */
	const load = async () => {
		try {
			const data = await getLocalStorage()
			setFavorites(data)
			setLoadingFavorites(false)
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * create local storage if it doesn't exist'
	 */
	const createLocalStorage = () => {
		try {
			setLocalStorage([])
			load()
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * if already in
	 */
	const isFound = (array, newElement) => {
		return array.some(element => {
			if (element.id === newElement.id)
			  return true
			return false
		})
	}

	/*
	 * add to local storage
	 */
	const addToLocalStorage = async (item) => {
		try {
			const data = await getLocalStorage()
			if(!isFound(data, item))
			{
				const newSet = [...data, item]
				setLocalStorage(newSet)
				setFavorites(newSet)
			}
			else{
				PopUpMessage({type:'info', message:'The query '+item.name+' is already inside the favorite queries'})
			}
			setLoadingFavorites(false)	
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * Update LocalStorage
	 */
	const updateLocalStorage = async (newItems) => {
		try {
			const data = await getLocalStorage()
			if(Array.isArray(newItems))
			{
				const newData = data.map(obj => {
					if (obj.id === newItems.id)
						return { ...newItems }
					return obj
				})
				setLocalStorage(newData)
				setFavorites(newData)
			}
			else
				PopUpMessage({type:'error', message: 'unsupported data'})
		} catch (error) {
			PopUpMessage({type:'error', message: error})
		}
	}

	/*
	 * get query by id
	 */
	const getQueryById = (id) => {
		return favorites.filter(f => f.id === id)
	}
	
	/*
	 * get monitor info
	 */
	const getMonitorInfo = (data) => {
		if(data?.monitorInfo)
			return data.monitorInfo
		else
			PopUpMessage({type:'error', message:'monitorInfo is undefined'})
	}

	/*
	 * load monitors
	 */
	const loadMonitors = (type,id) => {
		try {
			const query = getQueryById(id)
			if(query.length > 1)
				throw new Error("ERROR there is two queries with the same key")
			else{
				const monitors_ = getMonitorInfo(query[0]) // => [{...}]
				const arrageList_ = arrageMonitors(monitors_)
				dispatch(handleSelectedElemets(type, null, arrageList_, null))
			}
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}


	/*
	 * remove from favorites
	 */
	const removeFavorite = async (itemID) => {
		try {
			const data_ = await getLocalStorage()
			const filterData_ = data_.filter(f => f.id !== itemID)
			setLocalStorage(filterData_)
			load()
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * remove all favorites
	 */
	const removeAllFavorites = () => {
		try {
			setLocalStorage([])
			setFavorites([])
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * sort favorites
	 */
	const sortFavorites = () => {
		const lowerCase = val => val.toLowerCase()
		function compareASC(a, b){
			const a_ = lowerCase(a.name)
			const b_ = lowerCase(b.name)
			if (a_ < b_) return -1
			if (a_ > b_) return 1
		}
		function compareDESC(a, b){
			const a_ = lowerCase(a.name)
			const b_ = lowerCase(b.name)
			if (a_ > b_) return -1
			if (a_ < b_) return 1
		}
		try {
			const toggle = !sortToggle
			setSortToggle(toggle)
			const compare = (toggle) 
				? (a, b) => compareASC(a, b) 
				: (a, b) => compareDESC(a, b)
			setFavorites(favorites.sort(compare))
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * Handle Search For Monitors
	 */
	const handleSearchFavorites = value => {
		$('.sample-items-favorites').scrollTop(0)
		const fuse = new Fuse(favorites, {
			keys: ["name"],
		});
		const results = fuse.search(value)
		const searchResult = results.map(result => result.item)
		if (value === '')
			setResultQueryFavorite(favorites)
		else
			setResultQueryFavorite(searchResult)
	}

	/*
	 * Get current value of the search input from Monitors
	 */
	const handleOnSeacrhFavorites = ({ currentTarget = [] }) => {
		const { value } = currentTarget
		handleSearchFavorites(value)
	}

	/*
	 * get items
	 */
	useEffect(() => { 
		setLoadingFavorites(true)
		if(addItem && updatingQuery)
			updateLocalStorage(addItem)
		else if(addItem)
			addToLocalStorage(addItem)
		else if(localStorage.getItem('favorites') === null)
			createLocalStorage()
		else
			load()
	}, [addItem])

	/*
	 * initial search state
	 */
	useEffect(() => {
		if(favorites.length > 0)
			handleSearchFavorites("")
		else
			setResultQueryFavorite([])
	}, [favorites])

    return(
		<>
			<div className="favorite-sample-header">
				<Stack direction="column" spacing={0}>
					<Stack className="stack-row-components-title-buttons" direction="row">
						<p className="components-item-title">Marked Queries</p>
					</Stack>
					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search…"
							onChange={handleOnSeacrhFavorites}
							inputProps={{ 'aria-label': 'search' }}
							id="searchInputCompMon"
						/>
					</Search>
				</Stack>
			</div>
			<div className="sample-items sample-items-favorites">
				{
					(loadingFavorites) ? skeleton :
					(resultQueryFavorite.length === 0) ? noResultFound :
					resultQueryFavorite.map((element, index) =>
						<FavoriteElement
							key = { index }
							element = { element }
							loadMonitors = { loadMonitors }
							removeFavorite = { removeFavorite }
						/>
					)
				}
			</div>
			<div className="favorite-bottom-menu-actions">
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Stack>
						<LtTooltip
							title={
								<React.Fragment>
									<b className="label-indHlp-tooltip">{sectionHelperText}</b>
								</React.Fragment>
							} 
							placement="top" 
							className="tool-tip-options"
						>
							<IconButton>
								<HelpIcon sx={{color: '#e9e9e9'}}/>
							</IconButton>
						</LtTooltip>
					</Stack>
					<Stack
						direction="row"
						justifyContent="flex-end"
						alignItems="center"
						divider={<Divider orientation="vertical" flexItem />}
						spacing={1}
					>
						<LtTooltip
							title={(sortToggle) ? "DESC" : "ASC"}
							placement="top" 
							className="tool-tip-options"
							disableInteractive
						>
							<IconButton
								onClick={() => {sortFavorites()}}
							>
								<SortByAlphaIcon sx={{color: '#e9e9e9'}}/>
							</IconButton>
						</LtTooltip>
						<LtTooltip
							title={"Delete all marked queries"}
							placement="top" 
							className="tool-tip-options"
							disableInteractive
						>
							<IconButton
								onClick={() => {removeAllFavorites()}}
							>
								<DeleteSweepIcon sx={{color: '#e9e9e9'}}/>
							</IconButton>
						</LtTooltip>
					</Stack>
				</Stack>
			</div>
		</>
    );
}
export default FavoriteQueries;
