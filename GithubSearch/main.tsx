import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

async function onLoad() {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const root = createRoot(rootElement);
    root.render(
      <div>
        <Search></Search>
      </div>
    );
}

const Search = () => {
  const [name, setSearchName] = useState('');
  const [reposit, setReposit] = useState([]);

  const searchReposit = async () => {
    const url = `https://api.github.com/search/repositories?q=${name}&sort=stars&order=desc`;
    const response = await fetch(url);
    const data = await response.json();

    setReposit(data.items);
  };

  return (
    <div>
      <input type="text" value={name}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="Enter name of repository" />
      <button onClick={searchReposit}>Search</button>
      <ol>
        {reposit.map((repos: any) => (
          <li>
            <a href={repos.html_url}>{repos.html_url}</a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Search;

window.onload = onLoad;
