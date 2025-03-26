import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import StarIcon from "@mui/icons-material/Star";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React from "react";
import { useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/app/store/store";
import { Loader } from "@/shared/ui";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { fetchDataTitle, type ITitle } from "../model/slice";

export const TitlePage = () => {
  const dispatch = useAppDispatch();
  const titleDataList = useAppSelector(
    (state: RootState) => state.title.titleData,
  );

  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [inWatchlist, setInWatchlist] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const getTitleData = async () => {
    setIsLoading(true);
    await fetch(`${process.env.GET_TITLE}${id}`)
      .then(async (response) => await response.json())
      .then((response) => {
        dispatch(fetchDataTitle(response));
        setIsLoading(false);
        // Check if title is in watchlist
        checkWatchlistStatus(id);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  // Check if the title is already in the user's watchlist
  const checkWatchlistStatus = (titleId: string | undefined) => {
    if (!titleId) return;
    // Get watchlist from localStorage
    const watchlist = JSON.parse(
      localStorage.getItem("watchlist") || "[]",
    ) as string[];
    setInWatchlist(watchlist.includes(titleId));
  };

  // Toggle watchlist status
  const toggleWatchlist = (titleId: string, titleName: string) => {
    // Get current watchlist
    const watchlist = JSON.parse(
      localStorage.getItem("watchlist") || "[]",
    ) as string[];

    if (inWatchlist) {
      // Remove from watchlist
      const updatedWatchlist = watchlist.filter((id) => id !== titleId);
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      setInWatchlist(false);
      setSnackbarMessage(`"${titleName}" removed from your watchlist`);
    } else {
      // Add to watchlist
      watchlist.push(titleId);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      setInWatchlist(true);
      setSnackbarMessage(`"${titleName}" added to your watchlist`);
    }

    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  React.useEffect(() => {
    getTitleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      {isLoading ? (
        <Loader />
      ) : (
        titleDataList.map((data: ITitle) => {
          return (
            <Box key={data.id} bgcolor={"#f4f4f4"} minHeight="100%">
              <Container
                maxWidth="lg"
                sx={{
                  py: { xs: 2, md: 4 },
                  bgcolor: "#ffffff",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {/* Title and Basic Info */}
                <Grid container spacing={2} color={"#212121"}>
                  <Grid size={12}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="h3" component="h1" gutterBottom>
                        {data.title} {data.year && `(${data.year})`}
                      </Typography>
                      <Button
                        variant={inWatchlist ? "contained" : "outlined"}
                        color={inWatchlist ? "success" : "primary"}
                        startIcon={
                          inWatchlist ? (
                            <BookmarkAddedIcon />
                          ) : (
                            <BookmarkAddIcon />
                          )
                        }
                        onClick={() => toggleWatchlist(data.id, data.title)}
                        sx={{ height: "fit-content" }}
                      >
                        {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                      </Button>
                    </Box>

                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      {data.contentType && (
                        <Chip
                          label={data.contentType}
                          color="primary"
                          size="small"
                        />
                      )}
                      {data.contentRating && (
                        <Chip
                          label={data.contentRating}
                          color="warning"
                          size="small"
                        />
                      )}
                    </Box>
                  </Grid>

                  {/* Main Content - 3 Column Layout with adjusted proportions */}
                  <Grid container size={12} spacing={3}>
                    {/* Left Column - Image (made bigger) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      {data.image && (
                        <Avatar
                          variant="square"
                          sx={{
                            width: "100%",
                            height: "auto",
                            aspectRatio: "2/3",
                            borderRadius: 1,
                            mb: 2,
                            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                          }}
                          src={data.image}
                          alt={data.title}
                        />
                      )}
                    </Grid>

                    {/* Middle Column - Plot, Cast, etc. (made wider) */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      {/* Plot */}
                      {data.plot && (
                        <Box mb={3}>
                          <Typography variant="h6" gutterBottom>
                            Plot
                          </Typography>
                          <Typography variant="body1">{data.plot}</Typography>
                        </Box>
                      )}

                      <Divider sx={{ my: 2, bgcolor: "rgba(0,0,0,0.1)" }} />

                      {/* Cast */}
                      {data.actors && data.actors.length > 0 && (
                        <Box mb={3}>
                          <Typography variant="h6" gutterBottom>
                            Cast
                          </Typography>
                          <Typography variant="body1">
                            {data.actors.join(", ")}
                          </Typography>
                        </Box>
                      )}

                      {/* Directors */}
                      {data.directors && data.directors.length > 0 && (
                        <Box mb={3}>
                          <Typography variant="h6" gutterBottom>
                            Directors
                          </Typography>
                          <Typography variant="body1">
                            {data.directors.join(", ")}
                          </Typography>
                        </Box>
                      )}

                      {/* Runtime */}
                      {data.runtime && (
                        <Box mb={3}>
                          <Typography variant="h6" gutterBottom>
                            Runtime
                          </Typography>
                          <Typography variant="body1">
                            {data.runtime} minutes
                          </Typography>
                        </Box>
                      )}

                      {/* Filming Locations */}
                      {data.filmingLocations &&
                        data.filmingLocations.length > 0 && (
                          <Box mb={3}>
                            <Typography variant="h6" gutterBottom>
                              Filming Locations
                            </Typography>
                            <Typography variant="body1">
                              {data.filmingLocations.join(", ")}
                            </Typography>
                          </Box>
                        )}

                      {/* Genres - Moved to middle column bottom with divider */}
                      {data.genre && data.genre.length > 0 && (
                        <>
                          <Divider sx={{ my: 2, bgcolor: "rgba(0,0,0,0.1)" }} />
                          <Box mb={2}>
                            <Typography variant="h6" gutterBottom>
                              Genres
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                              {data.genre.map((genre, index) => (
                                <Chip key={index} label={genre} size="small" />
                              ))}
                            </Box>
                          </Box>
                        </>
                      )}
                    </Grid>

                    {/* Right Column - Rating (made smaller) */}
                    <Grid size={{ xs: 12, md: 2 }}>
                      {data.rating && data.rating.star && (
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          p={2}
                          bgcolor="#f4f4f4"
                          borderRadius={1}
                          mb={2}
                          height="fit-content"
                          border="1px solid rgba(0,0,0,0.1)"
                        >
                          <Box display="flex" alignItems="center" mb={1}>
                            <StarIcon
                              sx={{ color: "gold", mr: 1, fontSize: 28 }}
                            />
                            <Typography variant="h4" fontWeight="bold">
                              {data.rating.star.toFixed(1)}
                            </Typography>
                          </Box>
                          {data.rating.count > 0 && (
                            <Typography variant="body2" textAlign="center">
                              {data.rating.count.toLocaleString()} ratings
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Grid>
                  </Grid>

                  {/* Gallery */}
                  {data.images && data.images.length > 0 && (
                    <Grid size={12} mt={4}>
                      <Typography variant="h6" gutterBottom>
                        Gallery
                      </Typography>
                      <Box
                        display="flex"
                        gap={2}
                        sx={{
                          overflowX: "auto",
                          pb: 2,
                          "&::-webkit-scrollbar": {
                            height: 8,
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0,0,0,0.2)",
                            borderRadius: 4,
                          },
                        }}
                      >
                        {data.images.map((img, index) => (
                          <Box
                            key={index}
                            sx={{
                              minWidth: { xs: 220, sm: 250, md: 280 },
                              height: { xs: 130, sm: 150, md: 170 },
                              borderRadius: 1,
                              overflow: "hidden",
                              flexShrink: 0,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              bgcolor: "#ffffff",
                            }}
                          >
                            <img
                              src={img}
                              alt={`${data.title} image ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Container>

              {/* Snackbar for notifications */}
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity={inWatchlist ? "success" : "info"}
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Box>
          );
        })
      )}
    </>
  );
};
