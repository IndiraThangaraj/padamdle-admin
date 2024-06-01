import React, { useState, useEffect } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import './Table.css'

const Table = () => {
  const [rows, setRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState({ col6: {}, col9: {} });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://httpsflaskexample-wmsssx4hca-uc.a.run.app/padamdleadmin/randomtamilmovies?count=10');
        const data = await response.json();
        const formattedData = data.map((item, index) => ({
          id: index + 1,
          col1: index + 1, // Serial No
          col2: item.name, //movie name
          col3: '', // IMDB 
          col4: item.year, 
          col5: '', //Synopsis
          col6: Array(6).fill(''), // Images (array of 6)
          col7: null, //  Audio file input
          col8: null, // Video file input
          col9: Array(6).fill(''), // Youtube Videos array input
        }));
        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleInputChange = (id, column, index, value) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        if (Array.isArray(row[column])) {
          return {
            ...row,
            [column]: row[column].map((item, i) => i === index ? value : item)
          };
        } else {
          return {
            ...row,
            [column]: value
          };
        }
      }
      return row;
    }));
  };

  const handleFileChange = (id, column, file) => {
    setRows(rows.map(row => row.id === id ? { ...row, [column]: file } : row));
  };

  const toggleExpand = (id, column) => {
    setExpandedRows(prevState => ({
      ...prevState,
      [column]: {
        ...prevState[column],
        [id]: !prevState[column][id]
      }
    }));
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Serial No</th>
          <th>Movie Name</th>
          <th>IMDB</th>
          <th>Year</th>
          <th>Synopsis</th>
          <th>Images</th>
          <th>Audio</th>
          <th>Video</th>
          <th>Youtube Videos</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            <td>{row.col1}</td>
            <td>{row.col2}</td>
            <td>
              <input 
                type="text" 
                value={row.col3} 
                onChange={(e) => handleInputChange(row.id, 'col3', 0, e.target.value)} 
              />
            </td>
            <td>{row.col4}</td>
            <td>
              <input 
                type="text" 
                value={row.col5} 
                onChange={(e) => handleInputChange(row.id, 'col5', 0, e.target.value)} 
              />
            </td>
            <td>
              <div onClick={() => toggleExpand(row.id, 'col6')} style={{ cursor: 'pointer' }}>
                {expandedRows.col6[row.id] ? 'Done' : 'Add'}
              </div>
              {expandedRows.col6[row.id] && (
                <div>
                  {row.col6.map((val, index) => (
                    <div key={index}>
                      <input 
                        type="text" 
                        value={val} 
                        onChange={(e) => handleInputChange(row.id, 'col6', index, e.target.value)} 
                      />
                      {val && (
                        <Zoom>
                          <img 
                            src={val} 
                            alt={`Image ${index + 1}`} 
                            style={{ width: '100px', height: 'auto', margin: '5px' }}
                          />
                        </Zoom>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </td>
            <td>
              <input 
                type="file" 
                accept=".mp3" 
                onChange={(e) => handleFileChange(row.id, 'col7', e.target.files[0])} 
              />
            </td>
            <td>
              <input 
                type="file" 
                accept=".mp4" 
                onChange={(e) => handleFileChange(row.id, 'col8', e.target.files[0])} 
              />
            </td>
            <td>
              <div onClick={() => toggleExpand(row.id, 'col9')} style={{ cursor: 'pointer' }}>
                {expandedRows.col9[row.id] ? 'Done' : 'Add'}
              </div>
              {expandedRows.col9[row.id] && (
                <div>
                  {row.col9.map((val, index) => (
                    <input 
                      key={index} 
                      type="text" 
                      value={val} 
                      onChange={(e) => handleInputChange(row.id, 'col9', index, e.target.value)} 
                    />
                  ))}
                </div>
              )}
            </td>
            <td><button onClick={() => deleteRow(row.id)}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
