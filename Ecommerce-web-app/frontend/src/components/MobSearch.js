import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MobSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };
  return (
    <>
      <form className="d-flex" role="search" onSubmit={submitHandler}>
        <input
          style={{ outline: "none" }}
          className="form-control me-2"
          type="search"
          onChange={(e) => setQuery(e.target.value)}
          name="q"
          id="q"
          placeholder="Type to search ..."
          aria-label="Search"
        />
        <button className="btn btn-outline-primary btn-sm" type="submit">
          Search
        </button>
      </form>
    </>
  );
};

export default MobSearch;
