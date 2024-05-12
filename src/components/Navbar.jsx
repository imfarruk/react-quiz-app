import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
// firebase
import { getAuth, signOut } from "firebase/auth";
import { app } from '../firebase/firebase';


import { useSelector,useDispatch } from 'react-redux';
import { logoutUser } from '../store/actions/authAction';
import { MdMenuOpen } from "react-icons/md";
import { toast } from 'react-toastify';



const pages = ['Login', 'Signup'];
const settings = ['Profile', 'Logout'];


const auth = getAuth(app);


const Navbar = () => {
  const myData = useSelector(state => state.auth);
  const {isAuthenticated,user} = myData;
  console.log(user,'userrrr',isAuthenticated);
 const navigate = useNavigate();
  const dispatch = useDispatch();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
  
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

   
    const logout = ()=>{
      const logoutt = dispatch(logoutUser());
      navigate('/')
    
    }
    return (
        <>
        <AppBar position="static" sx={{height:'120px',display:'flex',alignItems:'center'}}>
      <Container maxWidth="xl" sx={{margin:'auto'}}>
        <Toolbar disableGutters>
          <Box  sx={{ flexGrow: 1,textAlign:'center',justifyContent:'center', display: { xs: 'flex', md: 'none' } }}>
          <Link to="/" style={{textDecoration:'none',color:'inherit'}}>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              justifyContent:'center'
            }}
          >
            Quiz App
          </Typography>
          </Link>
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            {
              myData.isAuthenticated !== true ? (
                <>
                <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MdMenuOpen />
              </IconButton>
              
            
          
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <Link to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem  onClick={handleCloseNavMenu}>
                  
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
                </Link>
                <Link to='/signup' style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem  onClick={handleCloseNavMenu}>
                  
                  <Typography textAlign="center">Signup</Typography>
                </MenuItem>
                </Link>
           

            </Menu>
            </>
           ) :(
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                 { !user ? (
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                  ):(
                  <Avatar alt="Remy Sharp" src={user.photoURL} />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                 <Link to='/profile'>
                  <MenuItem  onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" >Profile</Typography>
                  </MenuItem>
                  </Link>
                  <MenuItem  onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={logout}>Logout</Typography>
                  </MenuItem>
             
              </Menu>
            </Box>
           )
           }
          </Box>
          
         
          <Box  sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Link to="/" style={{color: 'inherit',
              textDecoration: 'none',}}>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              flexGrow:1,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Quiz App
          </Typography>
          </Link>
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>

            {myData.isAuthenticated !== true ? pages.map((page,i) => (
              <Link to={`/${page}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button
                key={i}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
              </Link>
            )):(
              <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
              <Link to='/profile'>
                  <MenuItem  onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" >Profile</Typography>
                  </MenuItem>
                  </Link>
                  <MenuItem  onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={logout}>Logout</Typography>
                  </MenuItem>
             
              </Menu>
            </Box>
            )
          
          }
          </Box>

          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting,i) => (
                <MenuItem key={i} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
        </>
        
    )
}

export default Navbar