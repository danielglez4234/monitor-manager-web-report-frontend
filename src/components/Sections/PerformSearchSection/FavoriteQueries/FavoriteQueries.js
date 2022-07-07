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
	Divider
}  from '@mui/material';
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
import PopUpMessage    from '../../../handleErrors/PopUpMessage';



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


/*
 * localStorage => 
 * setItem() :
 * getItem() :
 * removeItem() :
 * clear() :
 */

function FavoriteQueries({addItem}) {
	const dispatch = useDispatch()
	const [loadingFavorites, setLoadingFavorites] = useState(true)
	const [favorites, setFavorites] = useState([])
	const [resultQueryFavorite, setResultQueryFavorite] = useState([])

	// localStorage.setItem('favorites', JSON.stringify([{name: "hola?"}])) 

	const getLocalStorage = async () => {
		try {
			return await JSON.parse(localStorage.getItem('favorites'))
		} catch (error) {
			console.log(error)
		}
	}

	const setLocalStorage = (data) => {
		try {
			localStorage.setItem('favorites', JSON.stringify(data))
		} catch (error) {
			console.log(error)
		}
	}

	const load = async () => {
		try {
			const data = await getLocalStorage()
			setFavorites(data)
			setLoadingFavorites(false)
		} catch (error) {
			console.log(error)
		}
	}

	const createLocalStorage = () => {
		try {
			setLocalStorage([])
			load()
		} catch (error) {
			console.log(error)
		}
	}

	const addToLocalStorage = async (item) => {
		try {
			const data = await getLocalStorage()
			const newSet = [...data, item]
			setLocalStorage(newSet)
			setFavorites(newSet)
			setLoadingFavorites(false)	
		} catch (error) {
			console.log(error)
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
		return data.monitorInfo
	}

	/*
	 * load monitors
	 */
	const loadMonitors = (id) => {
		try {
			const query = getQueryById(id)
			if(query.length > 1)
				throw new Error("ERROR there is two queries with the same key")
			else{
				const monitors_ = getMonitorInfo(query[0])
				const arrageList_ = arrageMonitors(monitors_)
				dispatch(handleSelectedElemets('addMultiple', null, arrageList_, null))
			}
		} catch (error) {
			console.log(error)
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
			console.log(error)
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
			console.log(error)	
		}
	}

	/*
	 * sort favorites
	 */
	const sortFavorites = async () => {
		try {
			setFavorites(favorites.sort())
		} catch (error) {
			console.log(error)
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
		if(addItem)
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
		{/* <div className="favorite-title-box"> */}
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
						<IconButton>
							<HelpIcon sx={{color: '#e9e9e9'}}/>
						</IconButton>
					</Stack>
					<Stack
						direction="row"
						justifyContent="flex-end"
						alignItems="center"
						divider={<Divider orientation="vertical" flexItem />}
						spacing={1}
					>
						<IconButton
							onClick={() => {sortFavorites()}}
						>
							<SortByAlphaIcon sx={{color: '#e9e9e9'}}/>
						</IconButton>
						<IconButton
							onClick={() => {removeAllFavorites()}}
						>
							<DeleteSweepIcon sx={{color: '#e9e9e9'}}/>
						</IconButton>
					</Stack>
				</Stack>
			</div>
		{/* </div> */}
		</>
    );
}
export default FavoriteQueries;
