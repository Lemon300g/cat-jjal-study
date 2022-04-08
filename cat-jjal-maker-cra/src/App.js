import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Title from "./components/Title";
import Form from './components/Form';

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};





function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

function CatItem(props) {
  console.log(props);
  return (
    <li>
      {props.title}
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

const MainCard = ({ img, onHandelHeartClick, alreadyFevorite }) => {
  const heartIcon = alreadyFevorite ? "💖" : "🤍";

  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHandelHeartClick}>{heartIcon}</button>
    </div>
  );
};

// 위의 app 을 컴포넌트로 변경 (대문자로 시작하고 return 함)
const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [mainCat, setMainCat] = React.useState(CAT1);

  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const alreadyFevorite = favorites.includes(mainCat);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    console.log(newCat);
    setMainCat(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);
    const nextCounter = counter + 1;

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter + 1;
    });
  }

  function handelHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const counterTitle = counter === null ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{counterTitle} 고양이 가라사대!!!</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHandelHeartClick={handelHeartClick} alreadyFevorite={alreadyFevorite} />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
