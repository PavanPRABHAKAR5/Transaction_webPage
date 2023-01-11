import React from "react";
import { useState, useEffect } from "react";
import "./TableData.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import SearchIcon from "@mui/icons-material/Search";
import ImportExportIcon from "@mui/icons-material/ImportExport";

export default function TableData() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");

  useEffect(() => {
    fetch(
      "https://sim.iamvouched.com/v1/escrow/fetch_escrow_account_transactions",
      {
        method: "POST",
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIwNjA1OTliMi0xZGM4LTQ4MzUtYjRkNS05NjliNDdkNDQzNmYiLCJuYW1lIjoiWFlaIEludmVzdG1lbnQgVGVjaG5vbGdvaWVzIFB2dCBMdGQiLCJyZWciOiJXOEo1OXVQZ0RzVThCVW03QXVZQyIsImNvbmZpZyI6Inh5ekludmVzdCIsImlhdCI6MTY2MjQ5Mjc3NX0.umqDcA_8qP9A6EkKQoBKh_f6aURNwZNAdCztgU6baBk",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ escrow_id: "av-test" }),
      }
    )
      .then((res) => res.json())
      .then((jsonRes) => {
        console.log(jsonRes);
        setRows(jsonRes.data);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...rows].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setRows(sorted);
      setOrder("DSC");
    }

    if (order === "DSC") {
      const sorted = [...rows].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setRows(sorted);
      setOrder("ASC");
    }
  };

  return (
    <>
      <Card sx={{ minWidth: 275, m: 4 }}>
        <Box
          component="span"
          m={1}
          display="flex"
          justifyContent="space-between"
          pl={1}
          pt={1}
        >
          <div className="input">
            <SearchIcon className="search_Icon" />
            <input
              className="table_box"
              type="text"
              placeholder="Search"
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <button className="tableButton">Export</button>
        </Box>

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead
                sx={{
                  "& th": {
                    color: "rgba(76, 78, 100, 0.87)",
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                <TableRow>
                    
                  <TableCell align="center">
                    <div className="date_sort">
                      Date
                      <ImportExportIcon
                        className="sorting-icon"
                        onClick={() => sorting("tran_date")}
                      />
                    </div>
                  </TableCell>
                  
                  <TableCell align="center">Contact Name</TableCell>
                  <TableCell align="center">Debit</TableCell>
                  <TableCell align="center">Credit</TableCell>
                  <TableCell align="center">A/c Balance</TableCell>
                  <TableCell align="center">Transaction Note</TableCell>
                  <TableCell align="center">Remarks</TableCell>
                  <TableCell align="center">UTR/BANKRRN</TableCell>
                  <TableCell align="center">A/c No /UPI</TableCell>
                 
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .filter((item) => {
                    if (search == "") {
                      return item;
                    } else {
                      if (
                        item.tran_date.includes(search) ||
                        item.utr.toLowerCase().includes(search.toLowerCase()) ||
                        (item.remitter_name == undefined
                          ? ""
                          : item.remitter_name
                              .toLowerCase()
                              .includes(search.toLowerCase()))
                      ) {
                        return item;
                      }
                    }
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        sx={{
                          color: "rgba(76, 78, 100, 0.87)",
                        }}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.tranid}
                      >
                        <TableCell align="center">
                          <div className="row-Styling">
                            {row.tran_date.split("T")[0]}
                          </div>
                        </TableCell>

                        <TableCell align="center">
                          <div className="row-Styling">{row.remitter_name}</div>
                        </TableCell>

                        <TableCell align="center">
                          {row.type === "Payout" ? (
                            <div>{""}</div> // debit  Collect
                          ) : (
                            <div style={{ color: "#FF4D49" }}>{row.amount}</div>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          {row.type === "Collect" ? (
                            <div>{""}</div> // credit  Payout
                          ) : (
                            <div style={{ color: "#029646DE" }}>
                              {row.amount}
                            </div>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          {row.type === "Collect" ? (
                            <div>{(row.balance - row.amount).toFixed(2)}</div>
                          ) : (
                            <div>{(row.amount + row.balance).toFixed(2)}</div>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          <div className="row-Styling">
                            {row.transaction_note}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className="row-Styling">{row.remarks}</div>
                        </TableCell>
                        <TableCell align="center">
                          <div className="row-Styling">{row.utr}</div>
                        </TableCell>
                        <TableCell align="center">
                          <div className="row-Styling">
                            {row.remitter_acc_no}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Card>
    </>
  );
}
