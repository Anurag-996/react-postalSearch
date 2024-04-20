import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const App = () => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postalData, setPostalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchPostalData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      setLoading(false);
      if (data[0]?.Status === 'Success') {
        setPostalData(data[0]?.PostOffice || []);
        setFilteredData(data[0]?.PostOffice || []);
        setShowFilter(true);
        setSearched(true);
      } else {
        setPostalData([]);
        setFilteredData([]);
        setShowFilter(false);
        setError('Error fetching data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setShowFilter(false);
      setError('Error fetching data. Please try again.');
    }
  };

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = postalData.filter(
      (item) => item.Name.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      setPostalData([]);
      setFilteredData([]);
      setShowFilter(false);
      return;
    }
    fetchPostalData();
  };

  return (
    <div className="App">
      <h1>Enter Pincode</h1>
      {!searched && (
        <form onSubmit={handleSubmit}>
          <div className='input-container'>
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
          <button type="submit">Lookup</button>
        </form>
      )}
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {postalData.length > 0 && (
        <>
          <h3 style={{marginBottom:'10px' }}>Pincode: {pincode}</h3>
          <p style={{marginBottom:'10px' }}>
            <h3 style={{ display: 'inline' }}>Message: </h3>Number of pincode(s) found: {postalData.length}
          </p>
          {showFilter && (
            <div className="input-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input className='filter-input'
                type="text"
                placeholder="Filter by Post Office Name"
                onChange={handleFilter}
              />
            </div>
          )}
          <ul className='filter-output'>
            {filteredData.map((item, index) => (
              <li key={index}>
                <h3>{item.Name}</h3>
                <p>Pincode: {item.Pincode}</p>
                <p>District: {item.District}</p>
                <p>State: {item.State}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
