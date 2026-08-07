import { useState } from 'react'

export default function SearchBar({ onSearch, defaultCity }) {
  const [input, setInput] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (input.trim()) {
      onSearch(input.trim())
      setInput('')
    }
  }

  return (
    <form className="search-bar glass" onSubmit={handleSubmit}>
      <span className="search-icon">⌕</span>
      <input
        type="text"
        placeholder={`Search a city (e.g. ${defaultCity})…`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="search-btn">Search</button>
    </form>
  )
}
