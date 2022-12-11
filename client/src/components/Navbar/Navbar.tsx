import { Box, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddModal from "./AddModal";

import './Navbar.css'
import { Logout } from "@mui/icons-material";
import env from "../../environment";

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: 240,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        })},
    }),
);

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop: string) => prop !== 'open' })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: 240,
        width: `calc(100% - ${240}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

function Navbar (element : any) {
    const [open, setOpen] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const toggleDrawer = () => { setOpen(!open); };
    const navigate = useNavigate()
    const logout = () => {
        window.open(`${env.server.scheme}://${env.server.host}:${env.server.port}/auth/logout`, "_self");
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar sx={{backgroundColor: '#012b59'}} position="absolute" open={open}>
                <Toolbar sx={{ pr: '24px' }}>
                    <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}>
                        <MenuIcon/>
                    </IconButton>
                    <img alt="" src={"/logo.png"} height={40}/>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
                    <IconButton onClick={toggleDrawer}><ChevronLeftIcon /></IconButton>
                </Toolbar>
                <Divider/>
                <List component="nav">
                    <ListItemButton onClick={() => navigate('/projects')}>
                        <ListItemIcon><DashboardIcon/></ListItemIcon>
                        <ListItemText primary="Projects"/>
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate('/plan')}>
                        <ListItemIcon><CalendarMonthIcon/></ListItemIcon>
                        <ListItemText primary="Plan"/>
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate('/report')}>
                        <ListItemIcon><BarChartIcon/></ListItemIcon>
                        <ListItemText primary="Report"/>
                    </ListItemButton>
                    <Divider sx={{ my: 1 }}/>
                    <ListItemButton onClick={() => setShowModal(true)}>
                        <ListItemIcon><AddIcon/></ListItemIcon>
                        <ListItemText primary="Add Project"/>
                    </ListItemButton>
                    <ListItemButton onClick={() => logout()}>
                        <ListItemIcon><LogoutIcon/></ListItemIcon>
                        <ListItemText primary="Logout"/>
                    </ListItemButton>
                </List>
            </Drawer>
            <Box component="main" sx={{ backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100]: theme.palette.grey[900], flexGrow: 1, height: '100vh', overflow: 'auto'}}>
                {element.element}
            </Box>
            {
                showModal ?
                    <AddModal showModal={showModal} handleClose={() => setShowModal(false)}/>
                :
                    <></>
            }
        </Box>
    )
}

export default Navbar