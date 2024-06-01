import React from 'react';
import Table from './Table';
import logo from './logo.png'; // Import your logo file

const App = () => {
  return (
    <div className="App" style={{ backgroundColor: '#464d66', padding: '20px' }}>
      <header>
        <img src={logo} alt="Padamdle Logo" style={{ width: '100px', height: 'auto'}} />
        <h1>Padamdle Movie List</h1>
      </header>
      <Table />
    </div>
  );
};

export default App;
