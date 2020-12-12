import React, { Children } from "react";
import axios from "axios";

import "./App.css";

const title = "React";
// import "./App.css";

const welcome = {
  greeting: "hey",
  title: "yoyoyo",
};
function getTitle(title) {
  return title;
}

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};
const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
  );

const storiesReucer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [stories, dispatchStories] = React.useReducer(storiesReucer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  const handleFetchStories = React.useCallback(async () => {
    if (searchTerm === "") return;

    dispatchStories({ type: "FETCH_INIT" });
    try {
      const result = await axios.get(url);

      dispatchStories({
        type: "FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "FETCH_FAILURE" });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleRemoveStory = (item) => {
    dispatchStories({ type: "REMOVE_STORY", payload: item });
  };
  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };
  return (
    <div className="container">
      <h1 className="headline-primary">
        {welcome.greeting} {welcome.title} {getTitle("mama")} ! !
      </h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <hr />

      {stories.isError && <p>error</p>}
      {stories.isLoading ? (
        <p>Loadding ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
);

const InputWithLabel = ({
  id,
  label,
  value,
  type = "text",
  onInputChange,
  children,
}) => (
  <>
    <label htmlFor={id}>{children}</label>
    <input onChange={onInputChange} id={id} type={type} value={value} />
  </>
);

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item
      key={item.objectID}
      item={item}
      input={"item"}
      button={"button"}
      onRemoveItem={onRemoveItem}
    />
  ));

const Item = ({ item, onRemoveItem, input, button }) => (
  <div className={input}>
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: "30%" }}>{item.author}</span>
    <span style={{ width: "10%" }}>{item.num_comments}</span>
    <span style={{ width: "10%" }}>{item.points}</span>
    <span style={{ width: "10%" }}>
      <button
        type="button"
        className={`${button} button_small`}
        onClick={() => onRemoveItem(item)}
      >
        Dismiss
      </button>
    </span>
  </div>
);
export default App;
