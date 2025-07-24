import React, { useState } from 'react'
import axios from '../utils/axiosInstance' // Import the axios instance
import '../../scss/vendors/SearchComponent.scss' // Ensure your theme's CSS is included

const SearchComponent = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  const handleSearch = async () => {
    setError('') // Reset any existing error
    try {
      const response = await axios.get(`/api/v1/search?query=${encodeURIComponent(query)}`)
      setResults(response.data)
    } catch (error) {
      console.error('Error fetching search results:', error)
      setError('An error occurred while fetching search results. Please try again later.')
    }
  }

  return (
    <div className="search-component themed-component">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search files..."
        className="themed-input"
      />
      <button onClick={handleSearch} className="themed-button">
        Search
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="results-container">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <h4 className="result-title">File Name: {result._source.fileName}</h4>
            <p
              className="result-content"
              dangerouslySetInnerHTML={{
                __html: result.highlight?.content?.[0] || result._source.content,
              }}
            ></p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchComponent
