
  import { styled, alpha }                                from '@mui/material/styles';
  import InputBase                                        from '@mui/material/InputBase';
  import Tooltip, { TooltipProps, tooltipClasses }        from '@mui/material/Tooltip';
  import ArrowForwardIosSharpIcon                         from '@mui/icons-material/ArrowForwardIosSharp';
  import MuiAccordionDetails                              from '@mui/material/AccordionDetails';
  import MuiAccordion, { AccordionProps }                 from '@mui/material/Accordion';
  import MuiAccordionSummary, { AccordionSummaryProps, }  from '@mui/material/AccordionSummary';
  
  /* --------------------------------------
   * 
   * STYLES base, mui-material package 
   * 
   * -------------------------------------- */

  /*
   * Search input
   */
  export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  /*
   * Search Icon Wrapper
   */
  export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  /*
   * Input Base
   */
  export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`
    },
  }));


  /*
   * Accordion Base
   */
  export const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));
  
  /*
   * AccordionSummary Base
   */
  export const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  
  /*
   * AccordionDetails Base
   */
  export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

  /*
   * LtTooltip Base
   */
  export const LtTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#49525e',
      color: 'white',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));