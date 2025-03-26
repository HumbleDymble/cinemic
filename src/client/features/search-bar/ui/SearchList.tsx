import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Typography,
  Box,
  Fade,
  Skeleton,
  CircularProgress,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Portal,
} from "@mui/material";
import {
  clearSearchData,
  type ISearch,
  type SearchState,
} from "../model/slice";
import { useAppDispatch } from "@/app/store/store";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CloseIcon from "@mui/icons-material/Close";

export const SearchList = ({ search, searchData }: SearchState) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(true);
  // Add a state to control the fade animation
  const [fadeOut, setFadeOut] = useState(false);

  // Clear search data when location changes
  useEffect(() => {
    dispatch(clearSearchData());
  }, [location.key, dispatch]);

  // Reset visibility when search changes
  useEffect(() => {
    if (search) {
      setIsVisible(true);
      setFadeOut(false);
    }
  }, [search]);

  // Handle loading state
  useEffect(() => {
    if (search) {
      setIsLoading(true);
      setError(null);
      // Simulate loading state for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Simulate potential error (in a real app, this would be from API response)
        if (search === "error-test") {
          setError(
            "An error occurred while fetching results. Please try again.",
          );
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSelectedIndex(-1);
    }
  }, [search]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!search || searchData.length === 0 || !isVisible) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchData.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          if (selectedIndex >= 0 && selectedIndex < searchData.length) {
            e.preventDefault();
            const selectedItem = searchData[selectedIndex];
            handleItemClick(selectedItem);
            navigate(`/title/${selectedItem.id}`);
          }
          break;
        case "Escape":
          e.preventDefault();
          clearSearchAndInput();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [search, searchData, selectedIndex, dispatch, navigate, isVisible]);

  const handleItemClick = useCallback(
    (item: ISearch) => {
      dispatch({
        type: "recentViewed/operateLocalStorage",
        payload: item,
      });
    },
    [dispatch],
  );

  // Updated clear function to animate hiding the component
  const clearSearchAndInput = useCallback(() => {
    // Start fade out animation
    setFadeOut(true);

    // After animation completes, hide the component and clear data
    setTimeout(() => {
      setIsVisible(false);

      // Clear search results
      dispatch(clearSearchData());

      // Clear the search input by dispatching a custom action
      dispatch({
        type: "search/clearSearchInput",
        payload: null,
      });

      // Alternative approach: directly manipulate the search input element
      const searchInput = document.querySelector(
        'input[type="search"]',
      ) as HTMLInputElement;
      if (searchInput) {
        searchInput.value = "";
        // Trigger input event to ensure React state is updated
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 300); // Match this with the fade duration
  }, [dispatch]);

  if (!search || !isVisible) {
    return null;
  }

  // Image size calculation (20% bigger than previous 90x90)
  const imageSize = 108; // 90 * 1.2 = 108

  // The main content to render
  const content = (
    <Fade in={!fadeOut} timeout={300}>
      <Box
        sx={{
          mt: 1,
          position: "absolute",
          width: "100%",
          maxHeight: "75vh",
          overflowY: "auto",
          zIndex: 9999,
          boxShadow: "0 6px 14px rgba(0, 0, 0, 0.12)",
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
        }}
      >
        {error ? (
          <Fade in={true}>
            <Paper
              elevation={2}
              sx={{
                p: 2.5,
                textAlign: "center",
                mt: 1.5,
                backgroundColor: alpha(theme.palette.error.light, 0.1),
                border: `1px solid ${theme.palette.error.light}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <SearchOffIcon color="error" sx={{ fontSize: 40 }} />
              <Typography variant="body1" color="error">
                {error}
              </Typography>
              <IconButton
                onClick={clearSearchAndInput}
                size="small"
                color="primary"
                sx={{ mt: 0.5 }}
              >
                <CloseIcon fontSize="small" />{" "}
                <Typography variant="button" sx={{ ml: 0.5 }}>
                  Clear
                </Typography>
              </IconButton>
            </Paper>
          </Fade>
        ) : search && searchData.length === 0 && !isLoading ? (
          <Fade in={true}>
            <Paper
              elevation={2}
              sx={{
                p: 2.5,
                textAlign: "center",
                mt: 1.5,
                backgroundColor: alpha(theme.palette.info.light, 0.05),
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No results found for "{search}"
              </Typography>
              <IconButton
                onClick={clearSearchAndInput}
                size="small"
                sx={{ mt: 1 }}
                color="primary"
              >
                <CloseIcon fontSize="small" />{" "}
                <Typography variant="button" sx={{ ml: 0.5 }}>
                  Clear
                </Typography>
              </IconButton>
            </Paper>
          </Fade>
        ) : isLoading ? (
          // Loading skeleton
          <Box sx={{ position: "relative", p: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                px: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={16} thickness={4} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1.5 }}
                >
                  Searching for "{search}"...
                </Typography>
              </Box>
              <Tooltip title="Cancel search">
                <IconButton onClick={clearSearchAndInput} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            {Array.from(new Array(2)).map((_, index) => (
              <Paper
                key={`skeleton-${index}`}
                elevation={2}
                sx={{ mb: 1.5, p: 1.5 }}
              >
                <ListItem alignItems="center">
                  <ListItemAvatar sx={{ minWidth: imageSize + 20 }}>
                    <Skeleton
                      variant="rectangular"
                      width={imageSize}
                      height={imageSize}
                      animation="wave"
                      sx={{ borderRadius: 1 }}
                    />
                  </ListItemAvatar>
                  <Box sx={{ width: "100%", ml: 1 }}>
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={24}
                      animation="wave"
                    />
                  </Box>
                </ListItem>
              </Paper>
            ))}
          </Box>
        ) : (
          // Search results
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Found {searchData.length} result
                {searchData.length !== 1 ? "s" : ""} for "{search}"
              </Typography>
              <Tooltip title="Clear search">
                <IconButton onClick={clearSearchAndInput} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <List disablePadding>
              {searchData.map((item: ISearch, index: number) => {
                const isSelected = selectedIndex === index;

                return (
                  <Box key={item.id}>
                    <Fade in={true}>
                      <Paper
                        elevation={2}
                        sx={{
                          mx: 1.5,
                          mb: 1.5,
                          p: 1,
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 4,
                          },
                          cursor: "pointer",
                          border: isSelected
                            ? `1px solid ${theme.palette.primary.main}`
                            : "none",
                          backgroundColor: isSelected
                            ? alpha(theme.palette.primary.light, 0.1)
                            : "background.paper",
                        }}
                      >
                        <ListItem alignItems="center" disableGutters>
                          <ListItemAvatar sx={{ minWidth: imageSize + 20 }}>
                            <Link
                              to={`/title/${item.id}`}
                              rel="noreferrer"
                              onClick={() => handleItemClick(item)}
                              style={{ textDecoration: "none" }}
                            >
                              <Box
                                sx={{
                                  width: imageSize,
                                  height: imageSize,
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  boxShadow: 1,
                                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                  transition: "transform 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.05)",
                                  },
                                }}
                              >
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            </Link>
                          </ListItemAvatar>
                          <Link
                            to={`/title/${item.id}`}
                            rel="noreferrer"
                            onClick={() => handleItemClick(item)}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              width: "100%",
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  variant="subtitle1"
                                  component="div"
                                  sx={{
                                    color: isSelected
                                      ? theme.palette.primary.main
                                      : "text.primary",
                                    fontWeight: isSelected
                                      ? "medium"
                                      : "normal",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {item.title}
                                </Typography>
                              }
                            />
                          </Link>
                        </ListItem>
                      </Paper>
                    </Fade>
                  </Box>
                );
              })}
            </List>
          </Box>
        )}
      </Box>
    </Fade>
  );

  // Use Portal to render the component at the top level of the DOM
  return (
    <Portal container={document.body}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          mt: "60px", // Adjust based on your header height
          px: 2,
          maxWidth: "800px", // Increased from 600px to make it bigger
          mx: "auto",
          width: "100%",
        }}
      >
        {content}
      </Box>
    </Portal>
  );
};
