import {
  Avatar,
  Box,
  Button,
  Grid,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import IncomingCallIcon from "../Images/PhoneIncomingIcon.png";
import OutgoingCallIcon from "../Images/PhoneOutgoingIcon.png";
import MissedCallIcon from "../Images/MissedCall.png";
import SearchIcon from "@mui/icons-material/Search";
import FilterIcon from "../Images/FunnelSimple.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

let isFirst = false;
function formatDate(inputDate, inputTime) {
  const dateObj = new Date(`${inputDate} ${inputTime}`);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}
const formatFilterDate = (date1) => {
  if (!date1) return "";
  const date = new Date(date1);
  return date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`
    : "";
};
const RecentCallHistory = (props) => {
  console.log(props)
  const [search, setSearch] = useState("");
  const [CallHistory, setCallHistory] = useState(props.callHistory);
  const [isActive, setIsActive] = useState(3);
  const [sortItem, setSortItem] = useState("date");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [totalRows, setTotalRows] = useState(props.callHistory.length);
 
  const columns = [
    { field: "date", sortable: true, headerName: "Date", width: 300 },
    {
      field: "from",
      headerName: "From",
      sortable: true,
      width: 200,
    },
    {
      field: "to",
      headerName: "To",
      width: 200,
      sortable: true,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }} gap>
            <img
              src={
                params.row["Status"] === 0
                  ? IncomingCallIcon
                  : params.row["Status"] === 1
                  ? OutgoingCallIcon
                  : MissedCallIcon
              }
              alt=""
            />
            <Stack>
              <Typography sx={{ fontWeight: "600", fontSize: "0.8rem" }}>
                {params.row["ReceiverName"]}
              </Typography>
              <Typography sx={{ color: "#ABB1BA", fontSize: "0.8rem" }}>
                {params.row["to"]}
              </Typography>
            </Stack>
          </Box>
        );
      },
    },
    {
      field: "answeredby",
      headerName: "Answered by",
      width: 250,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }} gap>
            <Avatar
              alt="Remy Sharp"
              src="https://mui.com/static/images/avatar/1.jpg"
              sx={{ width: 24, height: 24 }}
            />

            <Typography sx={{ fontWeight: "600", fontSize: "0.8rem" }}>
              {params.row["answeredby"]}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 200,
    },
    {
      field: "cost",
      headerName: "Cost",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 150,
    },
  ];

  const rows = [
    ...CallHistory.map((item, index) => {
      return {
        id: item["_id"],
        date: formatDate(item["Date"], "09:29"),
        from: item["CallerNumber"],
        to: item["ReceiverNumber"],
        ReceiverName: item["ReceiverName"],
        answeredby: item["AnsweredBy"],
        duration: item["CallDuration"],
        cost: "₦ " + item["Cost"],
        Status: item["Status"],
      };
    }),
  ];

  useEffect(() => {
    if(isFirst)
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/callhistory?page=${
          paginationModel.page
        }&pagesize=${
          paginationModel.pageSize
        }&sort=${sortItem}&startdate=${formatFilterDate(
          startDate
        )}&enddate=${formatFilterDate(
          endDate
        )}&status=${isActive}&search=${search}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setCallHistory(response.data.data);
        setTotalRows(response.data.totalRows);
      })
      .catch((error) => {
        console.log(error);
      });
      isFirst = true;
  }, [
    paginationModel,
    sortItem,
    startDate,
    endDate,
    isActive,
    search,
  ]);

  const handlePageChange = (newPage) => {
    setPaginationModel((prevModel) => ({ ...prevModel, page: newPage }));
  };

  const handleSortChange = (sortModel) => {
    console.log(sortModel)
    const newSortItem = sortModel[0] || {};
    setSortItem(newSortItem.field || "");
  };
  const cleardate = () => {
    setEndDate("");
    setStartDate("");
  };

  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{ height: "10vh", marginTop: "0.5rem", marginBottom: "0.5rem" }}
      >
        <Grid item xs={4}>
          <Box
            sx={{
              border: "1px solid #DDE0E4",
              borderRadius: "0.2rem",
              height: "1.6rem",
              display: "flex",
              padding: "0.3rem 0.5rem",
              alignItems: "center",
            }}
          >
            <SearchIcon
              sx={{
                color: "#87909B",
                marginRight: "0.5rem",
                height: "1.2rem",
                width: "1.2rem",
              }}
            />
            <InputBase
              placeholder="Search call transaction ID"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              inputProps={{
                sx: {
                  "&::placeholder": {
                    fontSize: "0.7rem",
                  },
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box sx={{ border: "1px solid #DDE0E4", borderRadius: "0.2rem" }}>
            <Grid container spacing={0} padding="0.2rem">
              <Grid
                item
                xs={3}
                sx={{
                  textAlign: "center",
                  color: isActive === 3 ? "white" : "#ABB1BA",
                  backgroundColor: isActive === 3 ? "black" : "",
                  borderRadius: "0.2rem",
                  padding: "0.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setIsActive(3)}
              >
                <Typography sx={{ fontSize: "0.7rem", margin: "0.2rem" }}>
                  All
                </Typography>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  textAlign: "center",
                  color: isActive === 1 ? "white" : "#ABB1BA",
                  backgroundColor: isActive === 1 ? "black" : "",
                  borderRadius: "0.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setIsActive(1)}
              >
                <Typography sx={{ fontSize: "0.7rem" }}>Outgoing</Typography>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  textAlign: "center",
                  color: isActive === 0 ? "white" : "#ABB1BA",
                  backgroundColor: isActive === 0 ? "black" : "",
                  borderRadius: "0.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setIsActive(0)}
              >
                <Typography sx={{ fontSize: "0.7rem" }}>Incoming</Typography>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  textAlign: "center",
                  color: isActive === 2 ? "white" : "#ABB1BA",
                  backgroundColor: isActive === 2 ? "black" : "",
                  borderRadius: "0.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setIsActive(2)}
              >
                <Typography sx={{ fontSize: "0.7rem" }}>Missed</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box>
            <Grid container spacing={0}>
              <Grid item xs={10}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #DDE0E4",
                    borderRadius: "0.2rem",
                    padding: "0.2rem 0.5rem",
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<img src={FilterIcon} alt=""></img>}
                  >
                    <Typography sx={{ color: "#ABB1BA", fontSize: "0.7rem" }}>
                      Date Filter
                    </Typography>
                  </Button>

                  <Box sx={{ width: "30%" }}>
                    <DatePicker
                      selected={startDate}
                      placeholderText="Start date"
                      onChange={(date) => setStartDate(date)}
                      wrapperClassName="datePicker"
                      dateFormat="yyyy-MM-dd"
                      icon={<KeyboardArrowDownIcon sx={{ color: "#ABB1BA" }} />}
                    />
                  </Box>
                  <Box sx={{ width: "30%" }}>
                    <DatePicker
                      selected={endDate}
                      minDate={startDate}
                      placeholderText="End date"
                      onChange={(date) => setEndDate(date)}
                      wrapperClassName="datePicker"
                      dateFormat="yyyy-MM-dd"
                      icon={<KeyboardArrowDownIcon sx={{ color: "#ABB1BA" }} />}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Button
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={cleardate}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        pageSize={paginationModel.pageSize}
        pageSizeOptions={[5, 10, 20]}
        rowCount={totalRows||100}
        paginationMode="server"
        onPageChange={(newPage) => handlePageChange(newPage)}
        onSortModelChange={(sortModel) => handleSortChange(sortModel)}
        sortModel={[{ field: sortItem, sort: "asc" }]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  );
};

export default RecentCallHistory;
