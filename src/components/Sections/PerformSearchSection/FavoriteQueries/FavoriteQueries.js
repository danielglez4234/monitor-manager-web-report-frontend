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
 * localStorage
 * setItem() :
 * getItem() :
 * removeItem() :
 * clear() :
 */

function FavoriteQueries({addItem}) {
	const [loadingFavorites, setLoadingFavorites] = useState(true)
	const [favorites, setFavorites] = useState([])
	const [resultQueryFavorite, setResultQueryFavorite] = useState([])

	// localStorage.setItem('favorites', JSON.stringify([{name: "hola?"}])) 

	const init = async () => {
		try {
			console.log("init()")
			const data = await JSON.parse(localStorage.getItem('favorites'))
			setFavorites(data)
			setLoadingFavorites(false)
		} catch (error) {
			console.log(error)
		}
	}

	const createLocalStorage = async () => {
		try {
			await localStorage.setItem('favorites', JSON.stringify([]))
			init()
		} catch (error) {
			console.log(error)
		}
	}

	const addToLocalStorage = async (item) => {
		try {
			const data = await JSON.parse(localStorage.getItem('favorites'))
			const newSet = [...data, item]
			localStorage.setItem('favorites', JSON.stringify(newSet)) 
			setFavorites(newSet)
			setLoadingFavorites(false)	
		} catch (error) {
			console.log(error)
		}
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
			init()
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


	/*
	 * remove from favorites
	 */
	const removeFavorite = (itemID) => {
		try {
			localStorage.setItem("favorites", JSON.stringify(favorites.filter(f => f.id === itemID)))
		} catch (error) {
			console.log(error)
		}
	}

	/*
	 * remove all favorites
	 */
	const removeAllFavorites = () => {
		try {
			localStorage.setItem("favorites", JSON.stringify([]))
			setFavorites([])
		} catch (error) {
			console.log(error)	
		}
	}

	/*
	 * sort favorites
	 */
	const sortFavorites = () => {
		try {
			const data = JSON.parse(localStorage.getItem('favorites')) 
			setFavorites(data.sort())
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

    return(
		<div className="favorite-title-box">
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
		</div>
    );
}
export default FavoriteQueries;
