import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { RecentViewed } from "@/features/RecentViewed";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { useState, useRef } from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface Movie {
  title: string;
  image: string;
  rating: number; // Rating out of 10
}

export const Home = () => {
  const movies: Movie[] = [
    {
      title: "The Shawshank Redemption",
      image: "https://via.placeholder.com/150x225?text=Shawshank",
      rating: 9.3,
    },
    {
      title: "The Godfather",
      image: "https://via.placeholder.com/150x225?text=Godfather",
      rating: 9.2,
    },
    {
      title: "The Dark Knight",
      image: "https://via.placeholder.com/150x225?text=Dark+Knight",
      rating: 9.0,
    },
    {
      title: "Pulp Fiction",
      image: "https://via.placeholder.com/150x225?text=Pulp+Fiction",
      rating: 8.9,
    },
    {
      title: "Fight Club",
      image: "https://via.placeholder.com/150x225?text=Fight+Club",
      rating: 8.8,
    },
    {
      title: "Forrest Gump",
      image: "https://via.placeholder.com/150x225?text=Forrest+Gump",
      rating: 8.8,
    },
    {
      title: "Inception",
      image: "https://via.placeholder.com/150x225?text=Inception",
      rating: 8.8,
    },
    {
      title: "The Matrix",
      image: "https://via.placeholder.com/150x225?text=Matrix",
      rating: 8.7,
    },
    {
      title: "Goodfellas",
      image: "https://via.placeholder.com/150x225?text=Goodfellas",
      rating: 8.7,
    },
    {
      title: "The Silence of the Lambs",
      image: "https://via.placeholder.com/150x225?text=Silence+Lambs",
      rating: 8.6,
    },
    {
      title: "Interstellar",
      image: "https://via.placeholder.com/150x225?text=Interstellar",
      rating: 8.6,
    },
    {
      title: "The Lord of the Rings",
      image: "https://via.placeholder.com/150x225?text=LOTR",
      rating: 8.8,
    },
    {
      title: "Star Wars: Empire Strikes Back",
      image: "https://via.placeholder.com/150x225?text=Star+Wars",
      rating: 8.7,
    },
    {
      title: "The Green Mile",
      image: "https://via.placeholder.com/150x225?text=Green+Mile",
      rating: 8.6,
    },
    {
      title: "Schindler's List",
      image: "https://via.placeholder.com/150x225?text=Schindler",
      rating: 8.9,
    },
    {
      title: "Parasite",
      image: "https://via.placeholder.com/150x225?text=Parasite",
      rating: 8.5,
    },
    {
      title: "The Departed",
      image: "https://via.placeholder.com/150x225?text=Departed",
      rating: 8.5,
    },
    {
      title: "Gladiator",
      image: "https://via.placeholder.com/150x225?text=Gladiator",
      rating: 8.5,
    },
    {
      title: "Whiplash",
      image: "https://via.placeholder.com/150x225?text=Whiplash",
      rating: 8.5,
    },
    {
      title: "The Prestige",
      image: "https://via.placeholder.com/150x225?text=Prestige",
      rating: 8.5,
    },
    {
      title: "Casablanca",
      image: "https://via.placeholder.com/150x225?text=Casablanca",
      rating: 8.5,
    },
    {
      title: "Avengers: Endgame",
      image: "https://via.placeholder.com/150x225?text=Avengers",
      rating: 8.4,
    },
    {
      title: "Joker",
      image: "https://via.placeholder.com/150x225?text=Joker",
      rating: 8.4,
    },
    {
      title: "Titanic",
      image: "https://via.placeholder.com/150x225?text=Titanic",
      rating: 7.9,
    },
    {
      title: "The Lion King",
      image: "https://via.placeholder.com/150x225?text=Lion+King",
      rating: 8.5,
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const itemWidth = 200; // Width of each movie card including margins
  const visibleItems = 5; // Number of items visible at once

  // Custom 10-star rating component
  const TenStarRating = ({ value }: { value: number }) => {
    const stars = [];
    const roundedValue = Math.round(value * 2) / 2; // Round to nearest 0.5

    for (let i = 1; i <= 10; i++) {
      if (i <= roundedValue) {
        stars.push(
          <StarIcon key={i} sx={{ color: "#FFD700", fontSize: "14px" }} />,
        );
      } else if (i - 0.5 === roundedValue) {
        stars.push(
          <StarIcon
            key={i}
            sx={{
              color: "#FFD700",
              fontSize: "14px",
              clipPath: "inset(0 50% 0 0)",
            }}
          />,
        );
      } else {
        stars.push(
          <StarBorderIcon
            key={i}
            sx={{ color: "#FFD700", fontSize: "14px" }}
          />,
        );
      }
    }

    return (
      <Stack direction="row" spacing={0.2}>
        {stars}
      </Stack>
    );
  };

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount =
        direction === "left"
          ? -itemWidth * visibleItems
          : itemWidth * visibleItems;
      const newPosition = scrollPosition + scrollAmount;

      // Calculate max scroll position (total width - visible width)
      const maxScroll = itemWidth * (movies.length - visibleItems);

      // Handle circular scrolling
      let updatedPosition;
      if (newPosition < 0) {
        updatedPosition = maxScroll > 0 ? maxScroll : 0;
      } else if (newPosition > maxScroll) {
        updatedPosition = 0;
      } else {
        updatedPosition = newPosition;
      }

      setScrollPosition(updatedPosition);
      carouselRef.current.scrollTo({
        left: updatedPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <Grid container direction="column" bgcolor={"#e8e7f2"} minHeight="100vh">
      <Grid size={12}>
        <Navbar />
      </Grid>
      <Container>
        <Grid display="flex" justifyContent="center" alignItems="center" my={4}>
          <Box sx={{ width: "100%" }}>
            <Typography variant="h4" mb={2} fontWeight="bold">
              Popular Movies
            </Typography>
            <Box sx={{ position: "relative", width: "100%" }}>
              <IconButton
                onClick={() => handleScroll("left")}
                sx={{
                  position: "absolute",
                  left: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  bgcolor: "rgba(255,255,255,0.7)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <Box
                ref={carouselRef}
                sx={{
                  display: "flex",
                  overflowX: "hidden",
                  scrollBehavior: "smooth",
                  padding: "10px 0",
                  "&::-webkit-scrollbar": { display: "none" },
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                {movies.map((movie, index) => (
                  <Box
                    key={index}
                    sx={{
                      minWidth: `${itemWidth - 20}px`,
                      margin: "0 10px",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        height: 300,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        component="img"
                        src={movie.image}
                        alt={movie.title}
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                      />
                      <Box sx={{ p: 2, flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          noWrap
                          title={movie.title}
                        >
                          {movie.title}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <TenStarRating value={movie.rating} />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {movie.rating.toFixed(1)}/10
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                ))}
              </Box>

              <IconButton
                onClick={() => handleScroll("right")}
                sx={{
                  position: "absolute",
                  right: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  bgcolor: "rgba(255,255,255,0.7)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid size={12}>
          <RecentViewed />
        </Grid>
      </Container>
    </Grid>
  );
};
