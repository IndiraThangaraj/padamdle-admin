import React, { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./Table.css";

const Table = () => {
  const [rows, setRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState({ col6: {}, col9: {} });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://httpsflaskexample-wmsssx4hca-uc.a.run.app/padamdleadmin/movies"
        );
        const data = await response.json();
        const formattedData = Object.keys(data).map((key, index) => ({
          id: parseInt(key),
          col1: key, // Serial No
          col2: data[key].name, // Movie name
          col3: data[key].rating, // IMDB
          col4: data[key].year, // Year
          col5: data[key].synopsis, // Synopsis
          col6: data[key].images, // Images (array of 6)
          col7: data[key].song, // Audio file input
          col8: data[key].video, // Video file input
          col9: data[key].yt.split(","), // Youtube Videos array input
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleInputChange = (id, column, index, value) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          if (Array.isArray(row[column])) {
            return {
              ...row,
              [column]: row[column].map((item, i) =>
                i === index ? value : item
              ),
            };
          } else {
            return {
              ...row,
              [column]: value,
            };
          }
        }
        return row;
      })
    );
  };

  const handleFileChange = (id, column, file) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [column]: file } : row))
    );
  };

  const toggleExpand = (id, column) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [column]: {
        ...prevState[column],
        [id]: !prevState[column][id],
      },
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
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.col1}</td>
            <td>{row.col2}</td>
            <td>
              <input
                type="text"
                value={row.col3}
                onChange={(e) =>
                  handleInputChange(row.id, "col3", 0, e.target.value)
                }
              />
            </td>
            <td>{row.col4}</td>
            <td>
              <input
                type="text"
                value={row.col5}
                onChange={(e) =>
                  handleInputChange(row.id, "col5", 0, e.target.value)
                }
              />
            </td>
            <td>
              <div>
                {expandedRows.col6[row.id] ? (
                  <>
                    {row.col6 &&
                      row.col6.map((val, index) => (
                        <div key={index}>
                          <Zoom>
                            <img
                              src={val}
                              alt={`Image ${index + 1}`}
                              style={{
                                width: "100px",
                                height: "auto",
                                margin: "5px",
                              }}
                            />
                          </Zoom>
                        </div>
                      ))}
                    <button onClick={() => toggleExpand(row.id, "col6")}>
                      Collapse
                    </button>
                  </>
                ) : (
                  <button onClick={() => toggleExpand(row.id, "col6")}>
                    View
                  </button>
                )}
              </div>
            </td>
            <td>
              <div>
                {row.col7 && (
                  <>
                    <audio
                      controls
                      src={`https://firebasestorage.googleapis.com/v0/b/padamdle.appspot.com/o/${row.col7}.mp3?alt=media`}
                    />
                    <br />
                  </>
                )}
                <input
                  type="file"
                  accept=".mp3"
                  onChange={(e) =>
                    handleFileChange(row.id, "col7", e.target.files[0])
                  }
                />
              </div>
            </td>

            <td>
              <div>
                {row.col8 && (
                  <>
                    <video
                      controls
                      src={`https://firebasestorage.googleapis.com/v0/b/padamdle.appspot.com/o/${row.col8}.mp4?alt=media`}
                    />
                    <br />
                  </>
                )}
                <input
                  type="file"
                  accept=".mp4"
                  onChange={(e) =>
                    handleFileChange(row.id, "col8", e.target.files[0])
                  }
                />
              </div>
            </td>

            <td>
              <div>
                {expandedRows.col9[row.id] ? (
                  <>
                    {row.col9 &&
                      row.col9.map((val, index) => (
                        <div key={index}>
                          <a
                            href={`https://www.youtube.com/watch?v=${val}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`https://www.youtube.com/watch?v=${val}`}
                          </a>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) =>
                              handleInputChange(
                                row.id,
                                "col9",
                                index,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    <button onClick={() => toggleExpand(row.id, "col9")}>
                      Collapse
                    </button>
                    <button
                      onClick={() =>
                        handleInputChange(row.id, "col9", row.col9.length, "")
                      }
                    >
                      Add
                    </button>
                  </>
                ) : (
                  <button onClick={() => toggleExpand(row.id, "col9")}>
                    View
                  </button>
                )}
              </div>
            </td>

            <td>
              <button onClick={() => deleteRow(row.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
