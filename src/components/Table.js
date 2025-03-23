import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Table.css";

const API_URL = "http://localhost:5000/servers";

const Table = () => {
  const createNewRow = () => ({
    id: null, // ID will be assigned by MySQL
    serverName: [""],
    serverIP: [""],
    dcDr: [""],
    liveUat: [""],
    remarks: [""],
    publicIP: [""],
    purpose: [""],
    implementationYear: "",
    vendorName: "",
    vendorSupportL1: "",
    vendorSupportL2: "",
    bankSupportL1: "",
    bankSupportL2: "",
    roleOfPerson: "",
    serverType: "",
    osVersion: "",
    ipAddress: "",
    serverAdmin: "",
    dbTypeVersion: "",
    dbIPAddress: "",
  });

  const [rows, setRows] = useState([]);

  // ✅ Fetch data from MySQL when component loads
  useEffect(() => {
    axios.get(API_URL).then((response) => {
      setRows(response.data);
    });
  }, []);

  // ✅ Handle input changes (single and multi-input fields)
  const handleInputChange = (rowIndex, field, value, subIndex = null) => {
    setRows((prevRows) =>
      prevRows.map((row, index) => {
        if (index !== rowIndex) return row;

        if (Array.isArray(row[field]) && subIndex !== null) {
          const updatedField = [...row[field]];
          updatedField[subIndex] = value;
          return { ...row, [field]: updatedField };
        }

        return { ...row, [field]: value };
      })
    );
  };

  // ✅ Add an extra input field for multi-input columns
  const addMultiInput = (rowIndex, field) => {
    setRows((prevRows) =>
      prevRows.map((row, index) => {
        if (index !== rowIndex) return row;
        return { ...row, [field]: [...row[field], ""] };
      })
    );
  };

  // ✅ Add a new row and save to MySQL
  const addRow = () => {
    const newRow = createNewRow();
    axios.post(API_URL, newRow).then((response) => {
      setRows((prevRows) => [...prevRows, response.data]);
    });
  };

  // ✅ Save updates to MySQL when a field is edited
  const saveData = (rowIndex) => {
    const row = rows[rowIndex];
    if (row.id) {
      axios.put(`${API_URL}/${row.id}`, row).then(() => {
        console.log("✅ Row updated successfully");
      });
    } else {
      axios.post(API_URL, row).then((response) => {
        setRows((prevRows) =>
          prevRows.map((r, index) => (index === rowIndex ? response.data : r))
        );
      });
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>SL No.</th>
            <th>Server Name</th>
            <th>Server IP</th>
            <th>DC/DR</th>
            <th>Live/UAT</th>
            <th>Remarks</th>
            <th>Public IP</th>
            <th>Purpose</th>
            <th>Implementation Year</th>
            <th>Vendor Name</th>
            <th>Vendor Support L1</th>
            <th>Vendor Support L2</th>
            <th>Bank Support L1</th>
            <th>Bank Support L2</th>
            <th>Role of the Person</th>
            <th>Server Type</th>
            <th>OS & Version</th>
            <th>IP Address</th>
            <th>Server Admin</th>
            <th>DB Type & Version</th>
            <th>DB IP Address</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              <td>{rowIndex + 1}</td>

              {/* ✅ Multi-input fields */}
              {["serverName", "serverIP", "dcDr", "liveUat", "remarks", "publicIP", "purpose"].map((field) => (
                <td key={field}>
                  <div className="multi-input-container">
                    {row[field].map((value, subIndex) => (
                      <input
                        key={subIndex}
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(rowIndex, field, e.target.value, subIndex)}
                        onBlur={() => saveData(rowIndex)}
                      />
                    ))}
                    <button className="add-input-btn" onClick={() => addMultiInput(rowIndex, field)}>
                      +
                    </button>
                  </div>
                </td>
              ))}

              {/* ✅ Single-input fields */}
              {[
                "implementationYear",
                "vendorName",
                "vendorSupportL1",
                "vendorSupportL2",
                "bankSupportL1",
                "bankSupportL2",
                "roleOfPerson",
                "serverType",
                "osVersion",
                "ipAddress",
                "serverAdmin",
                "dbTypeVersion",
                "dbIPAddress",
              ].map((field) => (
                <td key={field}>
                  <input
                    type="text"
                    value={row[field]}
                    onChange={(e) => handleInputChange(rowIndex, field, e.target.value)}
                    onBlur={() => saveData(rowIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Add row button */}
      <button className="add-row-btn" onClick={addRow}>
        ➕ Add Row
      </button>
    </div>
  );
};

export default Table;
