import {
  Box,
  Button,
  Divider,
  InputBase,
  Typography,
  Tooltip,
  styled,
  Avatar,
  Stack,
  Badge,
  Radio,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import OnlineStatusIcon from "../../Images/OnlineStatus.png";
import axios from "axios";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 13,
  height: 13,
  border: `2px solid ${theme.palette.background.paper}`,
}));
const ContactModal = (props) => {
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [member, setMember] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await axios.get(`${process.env.REACT_APP_API_URL}/user/`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setMember(users.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  return (
    <Box sx={{backgroundColor:'#FFFFFE', width:"25vw", padding:"1rem", borderRadius:'0.3rem'}}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography sx={{ fontWeight: "600" }}>{props.title}</Typography>
        <Tooltip title='Close' placement='top'>
          <CloseIcon
            sx={{ color: "#CACED3", "&:hover": { cursor: "pointer" } }}
            onClick={() => {
              setSearch("");
              props.setOpenContactList(false);
            }}
          />
        </Tooltip>
      </Box>

      <Box
        sx={{
          backgroundColor: "#F9FAFB",
          display: "flex",
          alignItems: "center",
          borderRadius: "50px",
          padding: "0 0.5rem",
          margin: "1rem auto",
        }}>
        <SearchIcon sx={{ color: "#87909B" }} />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder='search user'
          inputProps={{ "aria-label": "search google maps" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Divider />
      <Box
        sx={{
          margin: "1rem 0",
          overflow: "scroll",
          height: "50vh",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}>
        <Box>
          <Stack spacing={2}>
            {member.map((m) => (
              <>
                <Box display='flex' justifyContent='space-between' width='100%' alignItems='center'>
                  <Box display='flex' width='100%' gap='0.7rem' alignItems='center'>
                    <Badge
                      overlap='circular'
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={<SmallAvatar alt='Remy Sharp' src={OnlineStatusIcon} />}>
                      <Avatar
                        alt='Remy Sharp'
                        src='https://mui.com/static/images/avatar/1.jpg'
                        sx={{ width: 35, height: 35 }}
                      />
                    </Badge>

                    <Stack>
                      <Typography sx={{ fontWeight: "800", fontSize: 12 }}>
                        {m.name}{" "}
                        {/* {m.CurrentUser && (
                          <Typography
                            variant='span'
                            sx={{ fontWeight: "normal", color: "#ABB1BA" }}>
                            You
                          </Typography>
                        )} */}
                      </Typography>
                      <Typography sx={{ color: "#ABB1BA", fontSize: 10 }}>{m.phone}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Radio
                      checked={selectedValue?._id === m._id}
                      onChange={() => setSelectedValue(m)}
                      value={m._id}
                      sx={{
                        "&, &.Mui-checked": {
                          color: "#4F772D",
                        },
                      }}
                    />
                  </Box>
                </Box>
                <Divider
                  sx={{
                    backgroundColor: "balck",
                    width: "100%",
                    borderColor: "#EBECEF",
                  }}
                />
              </>
            ))}
          </Stack>
        </Box>
      </Box>
      <Box>
        <Button
          variant='contained'
          sx={{ backgroundColor: "#4F772D", '&:hover':{
            backgroundColor:'#4F772D'
          } }}
          onClick={() => {
            setSearch("");
            props.addCallHanddler(selectedValue);
            props.setOpenContactList(false);
          }}
          fullWidth>
          {props.btnText}
        </Button>
      </Box>
    </Box>
  );
};

export default ContactModal;
