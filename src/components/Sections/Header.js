// --- React dependencies
import React, {useState} from 'react';

// --- Dependencies
import * as $  from 'jquery';

// --- Model Component elements
import {
	Avatar,
	AppBar, 
	Box, 
	Toolbar, 
	Typography, 
	IconButton, 
	Menu,
	MenuItem,
	ListItemIcon,
	Divider,
	Tooltip
}from '@mui/material';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

// --- Icons
import AnalyticsIcon  from '@mui/icons-material/Analytics';
import logoSrc        from '../../commons/img/logo.png';


const menuStyleProps = {
	elevation: 0,
	sx: {
		overflow: 'visible',
		filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
		mt: 1.5,
		'& .MuiAvatar-root': {
		width: 32,
		height: 32,
		ml: -0.5,
		mr: 1,
		},
		'&:before': {
		content: '""',
		display: 'block',
		position: 'absolute',
		top: 0,
		right: 14,
		width: 10,
		height: 10,
		bgcolor: 'background.paper',
		transform: 'translateY(-50%) rotate(45deg)',
		zIndex: 0,
		},
	},
	}


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






function Header() {
	// const [anchorEl, setAnchorEl] = useState(null);
	// const open = Boolean(anchorEl);
	// const handleClick = (event) => {
	//   setAnchorEl(event.currentTarget);
	// };
	// const handleClose = () => {
	//   setAnchorEl(null);
	// };


    return(
		<div className="header">
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						<img src={ logoSrc } className="header-logo" alt="logo"/>
						<Typography className="header-h2" variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Monitor Manager Web Report
						</Typography>
						{/* <div>
							<Typography sx={{ minWidth: 100 }}>dgonzalez</Typography>
						</div> */}
						{/* <div>
							<Tooltip title="Account settings">
							<IconButton
								onClick={handleClick}
								size="small"
								sx={{ ml: 2 }}
								aria-controls={open ? 'account-menu' : undefined}
								aria-haspopup="true"
								aria-expanded={open ? 'true' : undefined}
							>
								<Avatar sx={{ width: 32, height: 32, backgroundColor: "lightblue"}}>D</Avatar>
							</IconButton>
							</Tooltip>
							<Menu
								anchorEl={anchorEl}
								id="account-menu"
								open={open}
								onClose={handleClose}
								onClick={handleClose}
								PaperProps={menuStyleProps}
								transformOrigin={{ horizontal: 'right', vertical: 'top' }}
								anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
							>
								{
								(true) ?
									<MenuItem>
										<ListItemIcon>
											<Logout fontSize="small" />
										</ListItemIcon>
										Login
									</MenuItem>
									:
									<MenuItem>
										<ListItemIcon>
											<Logout fontSize="small" />
										</ListItemIcon>
										Logout
									</MenuItem>
								}
							</Menu>
						</div> */}
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
