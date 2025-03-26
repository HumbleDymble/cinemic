import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clearRecentViewedData, getDataFromLocalStorage } from "../model/slice";
import { type ISearch } from "../../search-bar/model/slice";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { Box, Card, CardContent, CardMedia, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HistoryIcon from "@mui/icons-material/History";
import { motion, AnimatePresence } from "framer-motion";

export const RecentViewed = () => {
  const dispatch = useAppDispatch();
  const recentViewed = useAppSelector(
    (state) => state.recentViewed.recentViewed,
  );
  const [isClearing, setIsClearing] = useState(false);

  const clearLocalStorage = () => {
    setIsClearing(true);
    // Delay the actual clearing to allow animation to complete
    setTimeout(() => {
      dispatch(clearRecentViewedData());
      localStorage.clear();
      setIsClearing(false);
    }, 500); // Match this with the exit animation duration
  };

  useEffect(() => {
    localStorage.getItem("recentViewed") && dispatch(getDataFromLocalStorage());
  }, [dispatch]);

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  // Animation variants for each item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Box
      sx={{
        padding: 2, // Reduced padding
        borderRadius: 2,
        backgroundColor: "rgba(245, 245, 245, 0.9)",
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.08)", // Lighter shadow
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Grid container minHeight="240px" direction="column" spacing={2}>
        {/* Reduced min height and spacing */}
        <Grid
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          {/* Reduced margin */}
          <Typography
            variant="subtitle1" // Smaller text
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              color: "#333",
              fontSize: "1.1rem", // Custom size
            }}
          >
            <HistoryIcon
              sx={{ mr: 0.5, color: "primary.main", fontSize: "1.2rem" }}
            />
            {/* Smaller icon */}
            Recently Viewed
          </Typography>
          <Tooltip title="Clear history">
            <Button
              onClick={clearLocalStorage}
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon sx={{ fontSize: "0.9rem" }} />} // Smaller icon
              size="small"
              sx={{
                borderRadius: 2,
                py: 0.5,
                px: 1,
                fontSize: "0.75rem",
                minWidth: "60px",
              }} // Smaller button
              disabled={isClearing || recentViewed.length === 0}
            >
              Clear
            </Button>
          </Tooltip>
        </Grid>
        <AnimatePresence mode="wait">
          {recentViewed.length > 0 && !isClearing ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: "100%" }}
            >
              <Grid container spacing={2}>
                {/* Reduced spacing */}
                <AnimatePresence>
                  {recentViewed.map((item: ISearch) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                      <motion.div variants={itemVariants} layout>
                        <Card
                          component={motion.div}
                          whileHover={{
                            scale: 1.03,
                            transition: { duration: 0.2 },
                          }}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: "0 1px 5px rgba(0, 0, 0, 0.08)", // Lighter shadow
                          }}
                        >
                          <Link
                            to={`/title/${item.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <CardMedia
                              component="img"
                              height="300" // Reduced height from 200 to 160
                              image={item.image}
                              alt={item.title}
                              sx={{
                                objectFit: "contain", // Changed from 'cover' to 'contain'
                                backgroundColor: "rgba(0,0,0,0.03)", // Light background
                                padding: "8px", // Added padding around the image
                                maxWidth: "100%", // Ensures image doesn't overflow
                                margin: "0 auto", // Centers the image horizontally
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.01)",
                                },
                              }}
                            />
                            <CardContent
                              sx={{
                                flexGrow: 1,
                                padding: 1.5,
                                paddingBottom: "12px !important",
                              }}
                            >
                              {/* Reduced padding */}
                              <Tooltip title={item.title} placement="top">
                                <Typography
                                  variant="body2" // Smaller text
                                  align="center"
                                  sx={{
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    color: "#333",
                                    fontSize: "0.85rem", // Custom size
                                  }}
                                >
                                  {item.title}
                                </Typography>
                              </Tooltip>
                            </CardContent>
                          </Link>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <Grid container>
                <Grid size={{ xs: 12 }} display="flex" alignItems="center">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      py: 4, // Reduced padding
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      borderRadius: 2,
                      border: "1px dashed rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <HistoryIcon
                        sx={{ fontSize: 40, color: "text.disabled", mb: 1 }}
                      />{" "}
                      {/* Smaller icon */}
                    </motion.div>
                    <Typography
                      align="center"
                      variant="body1" // Smaller text
                      color="text.secondary"
                      sx={{ mb: 0.5 }} // Reduced margin
                    >
                      No Recently Viewed Pages
                    </Typography>
                    <Typography
                      align="center"
                      variant="caption" // Smaller text
                      color="text.disabled"
                    >
                      Pages you've viewed would appear here.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Grid>
    </Box>
  );
};
