import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Rating,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useFetchCookies } from "@/pages/Auth/model/useFetchCookies";
import { RootState, useAppSelector } from "@/app/store/store";

interface WatchlistItem {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
  director: string;
  userRating?: number;
}

interface AddMovieForm {
  title: string;
  year: number;
  director: string;
  poster: string;
}

export const Watchlist: React.FC = () => {
  const generateMovies = (): WatchlistItem[] => {
    const movies = [
      {
        title: "The Shawshank Redemption",
        year: 1994,
        director: "Frank Darabont",
        rating: 9.3,
      },
      {
        title: "The Godfather",
        year: 1972,
        director: "Francis Ford Coppola",
        rating: 9.2,
      },
      {
        title: "The Dark Knight",
        year: 2008,
        director: "Christopher Nolan",
        rating: 9.0,
      },
      {
        title: "The Godfather Part II",
        year: 1974,
        director: "Francis Ford Coppola",
        rating: 9.0,
      },
      {
        title: "12 Angry Men",
        year: 1957,
        director: "Sidney Lumet",
        rating: 8.9,
      },
      {
        title: "Schindler's List",
        year: 1993,
        director: "Steven Spielberg",
        rating: 8.9,
      },
      {
        title: "The Lord of the Rings: The Return of the King",
        year: 2003,
        director: "Peter Jackson",
        rating: 8.9,
      },
      {
        title: "Pulp Fiction",
        year: 1994,
        director: "Quentin Tarantino",
        rating: 8.8,
      },
      {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        year: 2001,
        director: "Peter Jackson",
        rating: 8.8,
      },
      {
        title: "Forrest Gump",
        year: 1994,
        director: "Robert Zemeckis",
        rating: 8.8,
      },
      {
        title: "Inception",
        year: 2010,
        director: "Christopher Nolan",
        rating: 8.7,
      },
      {
        title: "Fight Club",
        year: 1999,
        director: "David Fincher",
        rating: 8.7,
      },
      {
        title: "The Matrix",
        year: 1999,
        director: "Lana and Lilly Wachowski",
        rating: 8.7,
      },
      {
        title: "Goodfellas",
        year: 1990,
        director: "Martin Scorsese",
        rating: 8.7,
      },
      {
        title: "The Lord of the Rings: The Two Towers",
        year: 2002,
        director: "Peter Jackson",
        rating: 8.7,
      },
      {
        title: "One Flew Over the Cuckoo's Nest",
        year: 1975,
        director: "Milos Forman",
        rating: 8.6,
      },
      { title: "Se7en", year: 1995, director: "David Fincher", rating: 8.6 },
      {
        title: "The Silence of the Lambs",
        year: 1991,
        director: "Jonathan Demme",
        rating: 8.6,
      },
      {
        title: "Saving Private Ryan",
        year: 1998,
        director: "Steven Spielberg",
        rating: 8.6,
      },
      {
        title: "Interstellar",
        year: 2014,
        director: "Christopher Nolan",
        rating: 8.6,
      },
      // ... adding more movies to reach 50
    ];

    // Generate additional movies to reach 50
    const titles = [
      "The Adventure",
      "Lost in Time",
      "The Journey",
      "Dark Nights",
      "New Dawn",
    ];
    const directors = [
      "John Smith",
      "Jane Doe",
      "Robert Johnson",
      "Mary Williams",
      "David Brown",
    ];

    while (movies.length < 50) {
      movies.push({
        title:
          titles[Math.floor(Math.random() * titles.length)] +
          " " +
          movies.length,
        year: Math.floor(Math.random() * (2023 - 1950) + 1950),
        director: directors[Math.floor(Math.random() * directors.length)],
        rating: Math.floor(Math.random() * 5) + 5, // Random rating between 5-10
      });
    }

    return movies.map((movie, index) => ({
      id: index + 1,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      poster: `https://example.com/movie${index + 1}.jpg`,
      director: movie.director,
      userRating: 0,
    }));
  };

  const [allWatchlist] = useState<WatchlistItem[]>(generateMovies());
  const [displayedItems, setDisplayedItems] = useState<WatchlistItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchCookies = useFetchCookies();

  const { uid, refreshToken } = useAppSelector(
    (state: RootState) => state.getCookies,
  );

  const navigate = useNavigate();

  React.useEffect(() => {
    fetchCookies();
  }, []);

  React.useEffect(() => {
    if (uid || refreshToken) {
      navigate("/");
    }
  }, [uid, refreshToken, navigate]);

  React.useEffect(() => {
    loadMoreItems();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && !loading) {
      const start = (page - 1) * itemsPerPage;
      if (start < allWatchlist.length) {
        loadMoreItems();
      }
    }
  };

  const loadMoreItems = () => {
    setLoading(true);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const newItems = allWatchlist.slice(start, end);

    if (newItems.length > 0) {
      setDisplayedItems((prev) => [...prev, ...newItems]);
      setPage(page + 1);
    }
    setLoading(false);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [newMovie, setNewMovie] = useState<AddMovieForm>({
    title: "",
    year: new Date().getFullYear(),
    director: "",
    poster: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [userTitle, setUserTitle] = useState("");

  const handleRemoveFromWatchlist = (id: number) => {
    setDisplayedItems(displayedItems.filter((item) => item.id !== id));
    setSnackbar({
      open: true,
      message: "Movie removed from watchlist",
      severity: "success",
    });
  };

  const handleRateMovie = (id: number, newRating: number | null) => {
    setDisplayedItems(
      displayedItems.map((item) =>
        item.id === id ? { ...item, userRating: newRating || 0 } : item,
      ),
    );
  };

  const handleAddMovie = () => {
    const newId = Math.max(...displayedItems.map((item) => item.id), 0) + 1;
    const movieToAdd: WatchlistItem = {
      ...newMovie,
      id: newId,
      rating: 0,
      userRating: 0,
      title: userTitle || newMovie.title,
    };
    setDisplayedItems([movieToAdd, ...displayedItems]);
    setOpenDialog(false);
    setNewMovie({
      title: "",
      year: new Date().getFullYear(),
      director: "",
      poster: "",
    });
    setUserTitle("");
    setSnackbar({
      open: true,
      message: "Movie added to watchlist",
      severity: "success",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Watchlist
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Movie
        </Button>
      </Box>

      <Box
        ref={containerRef}
        onScroll={handleScroll}
        sx={{ maxHeight: "80vh", overflow: "auto" }}
      >
        <Grid container spacing={3}>
          {displayedItems.map((item) => (
            <Grid size={12} key={item.id}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  component="img"
                  sx={{
                    width: 100,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                  src={item.poster}
                  alt={item.title}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2">
                    {item.title} ({item.year})
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Directed by {item.director}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Rating: {item.rating}/10
                      </Typography>
                      <Rating
                        value={item.rating}
                        readOnly
                        max={10}
                        precision={0.1}
                        icon={<StarIcon fontSize="inherit" />}
                        emptyIcon={<StarIcon fontSize="inherit" />}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Your Rating (1-10):
                      </Typography>
                      <Rating
                        value={item.userRating}
                        onChange={(_, newValue) =>
                          handleRateMovie(item.id, newValue)
                        }
                        max={10}
                        precision={1}
                        icon={<StarIcon fontSize="inherit" />}
                        emptyIcon={<StarIcon fontSize="inherit" />}
                      />
                    </Box>
                  </Box>
                </Box>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveFromWatchlist(item.id)}
                  sx={{ color: "error.main" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </Grid>
          ))}
          {displayedItems.length === 0 && (
            <Grid size={12}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  Your watchlist is empty. Add some movies to watch later!
                </Typography>
              </Paper>
            </Grid>
          )}
          {loading && (
            <Grid size={12}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography>Loading...</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Movie</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Your Title"
              fullWidth
              value={userTitle}
              onChange={(e) => setUserTitle(e.target.value)}
            />
            <TextField
              label="Title"
              fullWidth
              value={newMovie.title}
              onChange={(e) =>
                setNewMovie({ ...newMovie, title: e.target.value })
              }
            />
            <TextField
              label="Year"
              type="number"
              fullWidth
              value={newMovie.year}
              onChange={(e) =>
                setNewMovie({ ...newMovie, year: parseInt(e.target.value) })
              }
            />
            <TextField
              label="Director"
              fullWidth
              value={newMovie.director}
              onChange={(e) =>
                setNewMovie({ ...newMovie, director: e.target.value })
              }
            />
            <TextField
              label="Poster URL"
              fullWidth
              value={newMovie.poster}
              onChange={(e) =>
                setNewMovie({ ...newMovie, poster: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMovie} variant="contained">
            Add Movie
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
