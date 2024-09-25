import { Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Container className="bg-gray-400 ">
        <Typography variant="h5" gutterBottom>
          ゲームタイトル
        </Typography>
      </Container>
      <Link to={"/game"}>開始</Link>
    </>
  );
};

export default Home;
