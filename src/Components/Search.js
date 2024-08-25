import React, { useState } from "react";

const Search = ({ onSearch }) =>  {
    const [query, setQuery] = useState('');

    return (
        <div className="search_bar">
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={ (e) => {setQuery(e.target.value); onSearch(e.target.value)}}
            />
        </div>
    );
}

export default Search;
