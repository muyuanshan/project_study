import { Box, Typography } from "@mui/material";
// import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <Box>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
          variant="h2"
        >
          WELCOME TO RCC STAKE DAPP !
        </Typography>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
          color="#aaa"
          variant="h3"
        >
          Author By Brook.Yang
        </Typography>
      </Box>

      <footer className={styles.footer}>@ brook.yang</footer>
    </div>
  );
};

export default Home;
