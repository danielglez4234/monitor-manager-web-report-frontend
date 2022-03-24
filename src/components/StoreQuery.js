// --- React dependencies
import React, { Component }   from 'react';

// --- Dependencies
// import * as $                 from 'jquery';
import { 
  Search, 
  SearchIconWrapper, 
  StyledInputBase 
} from './standarFunctions';

// --- Model Component elements
import IconButton                   from '@mui/material/IconButton';
import { Stack, Button }            from '@mui/material/Stack';

// --- Icons
import SearchIcon                   from '@mui/icons-material/Search';
import PlayCircleIcon               from '@mui/icons-material/PlayCircle';
import PreviewIcon                  from '@mui/icons-material/Preview';
import EditIcon                     from '@mui/icons-material/Edit';
import DeleteForeverIcon            from '@mui/icons-material/DeleteForever';
import DataSaverOnIcon              from '@mui/icons-material/DataSaverOn';




class StoreQuery extends Component {

  render(){
    var storeQueryItem =  <div className="store-query-contain-box">
                            <div className="store-query-item-title-box">
                              <p className="store-query-item-title">Random Monitors</p>
                            </div>

                            <div className="store-query-consult-button-box">
                              <IconButton onClick={console.log("nope")/*() => {this.setStorequery()}*/} aria-label="play" className="stroreQueryButton">
                                <PlayCircleIcon />
                              </IconButton>
                              <IconButton aria-label="preview" className="stroreQueryButton">
                                <PreviewIcon />
                              </IconButton>
                              <IconButton aria-label="edit"className="stroreQueryButton">
                                <EditIcon />
                              </IconButton>
                              <IconButton aria-label="delete" className="stroreQueryButton">
                                <DeleteForeverIcon />
                              </IconButton>
                            </div>
                        </div>;


    return(
      <div className="store-query-section">
        <div className="sample-header-store-query">

          <Stack direction="column" spacing={1}>
            Store Querys

            <Button className="save-query-button" variant="contained"  startIcon={<DataSaverOnIcon />}>
              Save New Query
            </Button>
          </Stack>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </div>

          <div className="sample-items-store-query">

              { storeQueryItem }

          </div>
      </div>
    );
  }

}
export default StoreQuery;
