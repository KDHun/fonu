import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import Logo from "../Images/FonuLogo.png";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DialDots from "../Images/Vector.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import { Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const pages = [
  "Overview",
  "Inbox",
  "Phone numbers",
  "Calls",
  "SMS",
  "Bundle",
  "Teams",
  "Campaign",
  "Report",
  "Automations",
];
const pagesPaths = {};
pages.forEach((page) => (pagesPaths[page] = page.toLowerCase().replace(/\s/g, "")));
const dropDowns = ["SMS", "Campaign", "Report"];
function Navbar(props) {
  const [activeTab, setActiveTab] = useState(window.location.pathname.substring(1));
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <AppBar position='static' sx={{ backgroundColor: "Black" }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <img src={Logo} alt='Fonu' />

          <Typography
            variant='h6'
            noWrap
            component='a'
            href='#app-bar-with-responsive-menu'
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}>
            Fonu
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'>
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}>
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link
                    to={"/" + pagesPaths[page]}
                    onClick={() => setActiveTab(pagesPaths[page])}
                    style={{
                      textDecoration: "none",
                      color: activeTab === pagesPaths[page] ? "white" : "#616A75",
                    }}>
                    <Typography textAlign='center' sx={{ fontSize: "0.8rem" }}>
                      {page}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: "1rem",
            }}>
            {pages.map((page) => (
              <Link
                to={"/" + pagesPaths[page]}
                onClick={() => setActiveTab(pagesPaths[page])}
                style={{
                  textDecoration: "none",
                  color: activeTab === pagesPaths[page] ? "white" : "#616A75",
                }}>
                <Button
                  key={page}
                  sx={{
                    my: 2,
                    color: activeTab === pagesPaths[page] ? "white" : "#616A75",
                    display: "flex",
                    fontSize: "0.8rem",
                  }}
                  endIcon={dropDowns.includes(page) && <ExpandMoreIcon />}>
                  <Stack alignItems='center' position='relative'>
                    <Typography fontSize='0.8rem'>{page}</Typography>
                    {activeTab === pagesPaths[page] && (
                      <MinimizeRoundedIcon
                        sx={{
                          fontSize: "2rem",
                          color: "#4F772D",
                          position: "absolute",
                          end: "0",
                        }}
                      />
                    )}
                  </Stack>
                </Button>
              </Link>
            ))}
          </Box>

          <Box display='flex' justifyContent='center' alignItems='center' gap='1rem' >
            <Button
              variant='contained'
              sx={{
                backgroundColor: "white",
                borderRadius: "50px",
                gap: "10px",
                padding: "0.3rem 1rem",
                whiteSpace:"break-spaces"
              }}
              onClick={props.onDialPadClick}>
              <img src={DialDots} alt=':::' style={{ scale: "0.8" }} />
              <Typography color='black' fontSize='0.9rem' whiteSpace="nowrap">
                Dial pad
              </Typography>
            </Button>

            <NotificationsNoneOutlinedIcon />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}>
              <Avatar
                sx={{ width: 20, height: 20 }}
                alt='Remy Sharp'
                src='/static/images/avatar/2.jpg'
              />
              <Typography>₦ 0.00</Typography>
              <Typography
                variant='button'
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup='true'
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}>
                {open && <ExpandLessIcon />}
                {!open && <ExpandMoreIcon />}
              </Typography>
              <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={Logout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
