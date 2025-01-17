// App.js
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Snackbar,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Casino } from "@mui/icons-material";
import web3 from "./web3";
import lottery from "./lottery";
import styles from "./App.module.css";

const App = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    };
    fetchData();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("Waiting on transaction success...");
    setLoading(true);

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
    setLoading(false);
    setSnackbarOpen(true);
  };

  const onClick = async () => {
    setMessage("Waiting on transaction success...");
    setLoading(true);

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
    setLoading(false);
    setSnackbarOpen(true);
  };

  return (
    <Container className={styles.App} maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Casino fontSize="large" />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Lottery DApp
          </Typography>
        </Toolbar>
      </AppBar>

      <Box mt={4} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Lottery Contract
        </Typography>
        <Card className={styles.card}>
          <CardContent>
            <Typography variant="body1">
              This contract is managed by <strong>{manager}</strong>.
            </Typography>
            <Typography variant="body2">
              Currently, there are <strong>{players.length}</strong> people competing to win{" "}
              <strong>{web3.utils.fromWei(balance, "ether")} ether</strong>!
            </Typography>
          </CardContent>
        </Card>

        <Box mt={4} component="form" onSubmit={onSubmit}>
          <Typography variant="h6">Want to try your luck?</Typography>
          <TextField
            label="Amount of ether to enter"
            variant="outlined"
            fullWidth
            margin="normal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            sx={{
              width: { xs: "100%", sm: "80%", md: "60%" },
              mx: "auto",
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            fullWidth
            startIcon={loading && <CircularProgress size={24} color="inherit" />}
            sx={{
              fontSize: { xs: "0.8rem", sm: "1rem" },
              py: { xs: 1, sm: 1.5 },
              width: { xs: "100%", sm: "80%", md: "60%" },
              mx: "auto",
              mt: 2,
            }}
          >
            {loading ? "Processing..." : "Enter Lottery"}
          </Button>
        </Box>

        <Box mt={4}>
          <Typography variant="h6">Ready to pick a winner?</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClick}
            disabled={loading}
            fullWidth
            startIcon={loading && <CircularProgress size={24} color="inherit" />}
            sx={{
              fontSize: { xs: "0.8rem", sm: "1rem" },
              py: { xs: 1, sm: 1.5 },
              width: { xs: "100%", sm: "80%", md: "60%" },
              mx: "auto",
              mt: 2,
            }}
          >
            {loading ? "Processing..." : "Pick a Winner"}
          </Button>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          message={message}
        />
      </Box>
    </Container>
  );
};

export default App;