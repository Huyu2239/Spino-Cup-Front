import { Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLanguages } from "../api";

const Home = () => {
  const [languages, setLanguages] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const response = await getLanguages();
      console.log(response);
      if (response) {
        setLanguages(response.languages);
      }
    })();
  }, []);
  return (
    <>
      <div className=" bg-gradient-to-b to-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">選択できる言語</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {languages.map((language, i) => (
              <Link
                to={`/game/${language}`}
                key={i}
                className="transform transition duration-300 hover:scale-105"
              >
                <Card className="bg-white shadow-lg hover:shadow-xl">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-800">
                      {language}
                    </h2>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/game"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300"
            >
              言語選択をしない
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
