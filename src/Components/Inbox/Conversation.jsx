import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import EmptyInboxIcon from "../../Images/Inbox/emptyInbox.png";
import ConversationList from "./ConversationList";
import ChatBox from "./ChatBox";
const Conversation = (props) => {
  const [selectedChat, setSelectedChat] = useState(null);
  
  return (
    <Box>
      {props.activeItem.badgeCount === 0 ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
          height='90vh'
          >
          <img src={EmptyInboxIcon} alt='' style={{ scale: "0.9" }} />
          <Typography sx={{ color: "#CACED3" }} maxWidth='15%' textAlign='center'>
            You have no conversation in this inbox
          </Typography>
        </Box>
      ) : (
        <Box>
          <Grid container>
            <Grid item xs={3} sx={{ backgroundColor: "#FFFFFE",borderLeft:"1px solid #EBECEF" }}>
              <ConversationList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
            </Grid>
            <Grid item xs={9} sx={{ backgroundColor: "#FFFFFE", borderLeft:"1px solid #EBECEF"}}>
              {selectedChat&&<ChatBox selectedChat={selectedChat} setSelectedChat={setSelectedChat} />}
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Conversation;
