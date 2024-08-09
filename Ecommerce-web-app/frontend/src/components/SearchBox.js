import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };

  return (
    <form onSubmit={submitHandler}>
      <div style={{ border: "1px solid" }} className="bg-white">
        <input
          className="p-2 search_input"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          name="q"
          id="q"
          placeholder="Type to search ..."
        />
        <button type="submit" className="p-2 search_btn">
          <i className="bi bi-search"></i>
        </button>
      </div>
    </form>
  );
}
