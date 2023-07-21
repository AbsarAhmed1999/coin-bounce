import { useState, useEffect } from "react";
import { getNews } from "../../api/external";
import styles from "./Home.module.css";
import Loader from "../../components/Loader/Loader";
function Home() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    // if we want to use async method inside useEffect. we have to transform that method
    // into IIFE(immediately invoked function expression)
    //a JavaScript function that runs as soon as it is defined
    (async function newsApiCall() {
      const response = await getNews();
      setArticles(response);
    })();

    //cleanup function
    setArticles([]);
  }, []);
  const handleCardClick = (url) => {
    window.open(url, "_blank");
  };

  if (articles.length === 0) {
    return <Loader text="  Homepage" />;
  }
  return (
    <>
      <div className={styles.header}>Latest Articles</div>
      <div className={styles.grid}>
        {articles.map((article) => {
          return (
            <div
              className={styles.card}
              key={article.url}
              onClick={() => handleCardClick(article.url)}
            >
              <img src={article.urlToImage} alt="image" />
              <h3>{article.title}</h3>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Home;
