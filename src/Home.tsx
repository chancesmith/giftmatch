import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <>
      <Box sx={{ p: 7, textAlign: "center" }}>
        <Typography variant="h1">Simplify your gift exchange</Typography>
        <Typography variant="body1" sx={{ fontSize: 22, pt: 3 }}>
          Type in your list of people and generate your gift exchange list.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
          <Box sx={{ display: "flex", pr: 2 }}>
            <Button component={Link} to="/create" variant="contained">
              Create
            </Button>
          </Box>

          <Button component={Link} to="/history" variant="outlined">
            History
          </Button>
        </Box>
      </Box>
    </>
  );
};
