import axios from "axios";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  InputBase,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "../../Images/Inbox/Search.png";
import ChatTeardropDots from "../../Images/Inbox/ChatTeardropDots.png";
import Indicator from "../../Images/Inbox/Indicator.png";
import profileImg from "../../Images/Inbox/Profile Image.png";
import WhatsAppIcon from "../../Images/Inbox/Whatsapp icon.png";
import { updateBadgeCount, subscribeToConversationList } from "../../socket/Socket";
import ImageIcon from "@mui/icons-material/Image";
import MicIcon from '@mui/icons-material/Mic';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 15,
  height: 15,
  //   border: `2px solid ${theme.palette.background.paper}`,
}));
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    : isYesterday
    ? "Yesterday"
    : date.toLocaleDateString([], { year: "2-digit", month: "2-digit", day: "2-digit" });
}
const ConversationList = (props) => {
  const [isActive, setIsActive] = useState("Open");
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [chatList, setChatList] = useState([]);
  console.log(chatList,"chadd", searchResult,"searchadvfs")

  useEffect(() => {
    const getChatData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/chatlist`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setChatList(response.data);
      
        setSearchResult(response.data.filter((item) => item.unread_msg_count === 0));
      } catch (error) {
        console.log(error);
      }
    };
    getChatData();
  }, []);




useEffect(() => {
    const unsubscribe = subscribeToConversationList((data) => {
      setChatList((prev) => {
        return [
          ...prev.map((item) => {
            return item?._id === data?._id ? {...data,reciveUserId:item.reciveUserId} : item;
          }),
        ];
      });
      setSearchResult((prev) => {
        return [
          ...prev.map((item) => {
            return item?._id === data?._id ? {...data,reciveUserId:item.reciveUserId} : item;
          }),
        ];
      });
    });
    return unsubscribe;
  }, []);

  const tabChangeHandler = (data) => {
    setIsActive(data);
    const filteredData = chatList.filter((item) =>
      item.reciveUserId.name.toLowerCase().includes(searchText.toLowerCase()) && data === "Open"
        ? item.unread_msg_count === 0
        : data === "Unread"
        ? item.unread_msg_count > 0
        : false
    );
    setSearchResult(() => filteredData);
  };

  const chatClickHandler = (item) => {
    props.setSelectedChat(item);
    updateBadgeCount(item);

    setChatList((prev) =>
      prev.map((chat) => {
        if (chat?._id === item?._id) {
          return { ...chat, unread_msg_count: 0 };
        }
        return chat;
      })
    );
    setSearchResult((prev) =>
      prev.map((chat) => {
        if (chat?._id === item?._id) {
          return { ...chat, unread_msg_count: 0 };
        }
        return chat;
      })
    );
  };

  return (
    <Box width='100%' height='90vh' overflow='hidden'>
      <Grid
        container
        sx={{
          padding: "0.5rem",
          width: "100%",
          marginTop: "1rem",
        }}>
        <Grid
          item
          xs={10}
          sx={{
            padding: "0.2rem 1rem",
            backgroundColor: "#F9FAFB",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
          <img src={SearchIcon} alt='' />

          <InputBase
            placeholder='Search conversation'
            border='none'
            onChange={(e) => {
              setSearchText(e.target.value);
              const filteredData = chatList.filter(
                (item) =>
                  item.reciveUserId.name.toLowerCase().includes(e.target.value.toLowerCase()) &&
                  (isActive === "Open"
                    ? item.unread_msg_count === 0
                    : isActive === "Unread"
                    ? item.unread_msg_count > 0
                    : false)
              );
              setSearchResult(() => filteredData);
            }}
            sx={{
              "&::placeholder": {
                color: "red !important",
                backgroundColor: "#e35",
              },
            }}
          />
        </Grid>

        <Grid item xs={2} sx={{ display: "flex", placeContent: "center", placeItems: "center" }}>
          <img src={ChatTeardropDots} alt='' style={{}} />
        </Grid>
      </Grid>

      <Box display='flex' gap={1} paddingLeft='0.5rem'>
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
          <Button
            sx={{ color: isActive === "Open" ? "#1F2124" : "#ABB1BA", fontWeight: "700" }}
            onClick={() => tabChangeHandler("Open")}>
            Open
          </Button>
          {isActive === "Open" && <img src={Indicator} alt='' />}
        </Box>
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
          <Button
            sx={{ color: isActive === "Closed" ? "#1F2124" : "#ABB1BA", fontWeight: "700" }}
            onClick={() => tabChangeHandler("Closed")}>
            Closed
          </Button>
          {isActive === "Closed" && <img src={Indicator} alt='' />}
        </Box>
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
          <Button
            sx={{ color: isActive === "Unread" ? "#1F2124" : "#ABB1BA", fontWeight: "700" }}
            onClick={() => tabChangeHandler("Unread")}>
            Unread
          </Button>
          {isActive === "Unread" && <img src={Indicator} alt='' />}
        </Box>
      </Box>

      <Divider sx={{ marginTop: "-0.1rem !important" }} />

      <Box
        height='76.62vh'
        sx={{
          overflow: "scroll",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "&-ms-overflow-style:": {
            display: "none",
          },
        }}>
        {searchResult?.map((chat, index) => {
          return (
            <Box
              key={index}
              sx={{
                padding: "0.5rem 1rem",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: chat?._id===props.selectedChat?._id?"#F1F2F4":"",
                cursor: "pointer",
              }}
              onClick={() => {
                chatClickHandler(chat);
              }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Box>
                  <Badge
                    overlap='circular'
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={<SmallAvatar alt={chat.reciveUserId.name} src={WhatsAppIcon} />}>
                    <Avatar
                      alt={chat.socialMedia}
                      src={profileImg}
                      sx={{ width: 30, height: 30 }}
                    />
                  </Badge>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: "600", fontSize: "0.8rem" }}>
                    {chat.reciveUserId.name}
                  </Typography>
                  {chat.last_media_type === 1 && (
                    <Box sx={{ display:'flex' ,alignItems:'center', justifyContent:'start', gap:1 }}>
                      <ImageIcon sx={{ fontSize: 15 }} />
                      <Typography sx={{ color: "#ABB1BA", fontSize: "0.7rem" }}> Photo</Typography>
                    </Box>
                  )}
                  {chat.last_media_type === 2 && (
                    <Box sx={{ display:'flex' ,alignItems:'center', justifyContent:'start', gap:1 }}>
                      <MicIcon sx={{ fontSize: 15 }} />
                      <Typography sx={{ color: "#ABB1BA", fontSize: "0.7rem" }}> Audio</Typography>
                    </Box>
                  )}
                  {chat.last_media_type === 0 && (<Typography sx={{ color: "#ABB1BA", fontSize: "0.7rem" }}>
                    {chat.last_message.substring(0, 25).concat(chat.last_message.length>25?"...":"")}
                  </Typography>)}
                </Box>
              </Box>

              <Box display='flex' flexDirection='column' justifyContent='end'>
                <Typography sx={{ color: "#ABB1BA", fontSize: "0.7rem" }}>
                  {formatDate(chat.last_message_time)}
                </Typography>
                <Box textAlign='end' marginRight='0.5rem'>
                  <Badge
                    overlap='circular'
                    sx={{
                      color: "white",
                      "& .MuiBadge-badge": {
                        color: "white",
                        backgroundColor: "#4F772D",
                        fontSize: "0.7rem",
                      },
                    }}
                    badgeContent={chat.unread_msg_count}></Badge>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ConversationList;
