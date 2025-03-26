import React from "react";
import { Link } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/app/store/store";
import { addSearchData } from "@/features/search-bar/model/slice";
import { signOut } from "@/pages/Auth/model/authSlice";
import { api, token } from "@/shared/api/api";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
  Box,
  Container,
  Drawer,
  List,
  ListItemText,
} from "@mui/material";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon, // Hamburger icon
} from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import debounce from "lodash.debounce";
import { SearchList } from "@/features/search-bar";

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [search, setSearch] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [logout] = api.useLogoutMutation();
  const user = useAppSelector((state) => state.auth.user);
  const { data } = api.useCheckAuthQuery(undefined, {
    skip: !user,
  });
  const searchData = useAppSelector(
    (state: RootState) => state.search.searchData,
  );
  const [drawerOpen, setDrawerOpen] = React.useState(false); // Drawer state

  const getSearchData = async (query: string) => {
    if (query.trim()) {
      try {
        const response = await fetch(`${process.env.GET_SEARCH}${query}`);
        const data = await response.json();
        dispatch(addSearchData(data.results));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const debouncedSearch = React.useCallback(debounce(getSearchData, 500), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSignOut = () => {
    dispatch(signOut());
    logout();
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Toggle drawer visibility
  };

  const username = user?.username || "";
  const userInitial = data?.user?.username.charAt(0).toUpperCase();

  return (
    <AppBar position="static" color="default" elevation={3}>
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <Container maxWidth="lg">
          <Grid container>
            {/* Desktop: Home icon and search bar */}
            {!isMobile && (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    component={Link}
                    to="/"
                  >
                    <HomeIcon />
                  </IconButton>
                </Box>

                {/* Search Bar */}
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: 2,
                      px: 1,
                      bgcolor: "background.paper",
                      border: 1,
                      borderColor: "divider",
                      width: { xs: "70%", sm: "70%" },
                    }}
                  >
                    <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                    <TextField
                      fullWidth
                      placeholder="Search..."
                      type="search"
                      size="small"
                      onChange={handleSearchChange}
                      variant="outlined"
                      sx={{ "& fieldset": { border: "none" } }}
                    />
                  </Box>
                  {search && (
                    <SearchList search={search} searchData={searchData} />
                  )}
                </Box>
              </>
            )}

            {/* Mobile: Hamburger Menu for Navigation */}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Desktop/Logged in user */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {!isMobile && (
                  <Button
                    component={Link}
                    to="/user/watchlist"
                    startIcon={<BookmarkIcon />}
                  >
                    Watchlist
                  </Button>
                )}
                {data?.user?.username || user?.username ? (
                  <>
                    <Tooltip title={`Logged in as ${data?.user?.username}`}>
                      <IconButton onClick={handleMenuOpen} size="small">
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {userInitial}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        component={Link}
                        to="/user/profile"
                        onClick={handleMenuClose}
                      >
                        <PersonIcon sx={{ mr: 1 }} /> Profile
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleSignOut}>
                        <LogoutIcon sx={{ mr: 1 }} /> Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button component={Link} to="/user/signin" variant="outlined">
                    Sign in
                  </Button>
                )}
              </Box>
            )}
          </Grid>
        </Container>
      </Toolbar>

      {/* Drawer for Mobile Menu */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          <Button component={Link} to="/" onClick={handleDrawerToggle}>
            <ListItemText primary="Home" />
          </Button>
          <Button component={Link} to="/user/watchlist" onClick={handleDrawerToggle}>
            <ListItemText primary="Watchlist" />
          </Button>
          {token ? (
            <>
              <Button
                component={Link}
                to="/user/profile"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Profile" />
              </Button>
              <Button onClick={handleSignOut}>
                <ListItemText primary="Logout" />
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/user/signin"
              onClick={handleDrawerToggle}
            >
              <ListItemText primary="Sign In" />
            </Button>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};
