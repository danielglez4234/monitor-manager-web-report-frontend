// --- React dependencies
import React   from 'react';

// --- Dependencies
import * as $  from 'jquery';

// --- Model Component elements
import {
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  IconButton
}from '@mui/material';

// --- Icons
import AnalyticsIcon  from '@mui/icons-material/Analytics';
import logoSrc        from '../commons/img/logo.png';


function Header() {

  const hideAllAndShowGrafic = () => {
    var listCompMonSection = $('.SampleMonitorList-section');
    var performQuSection   = $('.perform-query-section');
    var slctMonSection     = $(".menu-monitorSelected-contain");


    if (!listCompMonSection.hasClass('hide-sections') || !performQuSection.hasClass('hide-sections')
        || !slctMonSection.hasClass('hide-sections')){

      if (!listCompMonSection.hasClass('hide-sections')){
        listCompMonSection.addClass('hide-sections');
        $('.arrow-showListSection').removeClass('hide-sections');
      }
      if (!performQuSection.hasClass('hide-sections')){
        performQuSection.addClass('hide-sections');
        $('.arrow-showPerfomSection').removeClass('hide-sections');
      }
      if (!slctMonSection.hasClass('hide-sections')){
        slctMonSection.addClass('hide-sections');
        $(".selected-monitors-select-all").addClass('hide-sections');
        $('.rotback').removeClass('activeExpandColor');
        $('.visibilityLarge-icon').removeClass('rotate180');
        $('.visibilityMiddle-icon').removeClass('rotate180');
        $('.visibilityOff-icon').addClass('rotate180 activeExpandColor');
      }
    }
    else {
     $('.arrow-showListSection').addClass('hide-sections');
     $('.arrow-showPerfomSection').addClass('hide-sections');
     $('.visibilityOff-icon').removeClass('rotate180 activeExpandColor');
     $('.visibilityMiddle-icon').addClass('activeExpandColor');

     listCompMonSection.removeClass('hide-sections');
     performQuSection.removeClass('hide-sections');
     slctMonSection.removeClass('hide-sections');
     $(".selected-monitors-select-all").removeClass('hide-sections');
     $(".menu-monitorSelected-contain").css('height', "98px");
    }
  }

    return(
      <div className="header">
        <Box sx={{ flexGrow: 1 }}>
         <AppBar position="static">
           <Toolbar>
               <img src={ logoSrc } className="header-logo" alt="logo"/>
             <Typography className="header-h2" variant="h6" component="div" sx={{ flexGrow: 1 }}>
               Monitor Manager Web Report
             </Typography>
               <div>
                 <IconButton
                   onClick={() =>{ hideAllAndShowGrafic() }}
                   size="large"
                   aria-label="account of current user"
                   aria-controls="menu-appbar"
                   aria-haspopup="true"
                   color="inherit"
                 >
                   <AnalyticsIcon />
                 </IconButton>
               </div>
           </Toolbar>
         </AppBar>
       </Box>
      </div>
    );


}
export default Header;
