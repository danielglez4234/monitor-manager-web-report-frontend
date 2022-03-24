import React          from 'react';

import Button                       from '@mui/material/Button';

import SearchIcon                   from '@mui/icons-material/Search';
import TableChartIcon               from '@mui/icons-material/TableChart';
import StackedBarChartIcon          from '@mui/icons-material/StackedBarChart';

import { 
  Search,
  SearchIconWrapper,
  StyledInputBase
} from './standarFunctions';

const MenuGraficOrTable = () => {
  return(
    <div className="buttons-and-search-section">
      <Button className="btn-and-srch btn-and-srch-grafic-button" variant="contained" startIcon={<StackedBarChartIcon />}>
        Grafic
      </Button>
      <Button className="btn-and-srch btn-and-srch-table-button" variant="contained" startIcon={<TableChartIcon />}>
        Table
      </Button>

      <Search className="search-on-table">
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder= "Search…"
          inputProps={{ 'aria-label': 'search' }}
        />
    </Search>
  </div>
  );
}

export default MenuGraficOrTable;
