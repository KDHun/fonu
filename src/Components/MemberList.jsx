import {
  Avatar,
  Badge,
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import AdminIcon from "../Images/Admin.png";
import UserIcon from "../Images/User.png";
import OnlineStatusIcon from "../Images/OnlineStatus.png";


const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 13,
  height: 13,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const MemeberList = (props) => {

  const Member = [
    {
      Name: "Deanna Curtis",
      Number: "+234 70 9332 7543",
      IsAdmin: true,
      CurrentUser: true,
    },
    ...props.members.map((member) => {
      return {
        Name: member.firstName + " " + member.lastName,
        Number: member.mobileNumber,
      };
    }),
  ];

  return (
    <Paper
      elevation={5}
      sx={{
        padding: "1.5rem 1.5rem",
        backgroundColor: "white",
        color: "black",
        borderRadius: "10px",
        overflow: "scroll",
        height: "41vh",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Stack spacing={2}>
        {Member.map((m,i) => (
          <Box key={i}>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              <Box display="flex" width="100%" gap="0.7rem" alignItems="center">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <SmallAvatar alt="Remy Sharp" src={OnlineStatusIcon} />
                  }
                >
                  <Avatar
                    alt="Remy Sharp"
                    src="https://mui.com/static/images/avatar/1.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                </Badge>

                <Stack>
                  <Typography sx={{ fontWeight: "800", fontSize: 12 }}>
                    {m.Name}{" "}
                    {m.CurrentUser && (
                      <Typography
                        variant="span"
                        sx={{ fontWeight: "normal", color: "#ABB1BA" }}
                      >
                        You
                      </Typography>
                    )}
                  </Typography>
                  <Typography sx={{ color: "#ABB1BA", fontSize: 10 }}>
                    {m.Number}
                  </Typography>
                </Stack>
              </Box>

              {m.IsAdmin ? (
                <Box display="flex" gap="0.5rem">
                  <img src={AdminIcon} alt="" style={{ height: "1rem" }} />
                  <Typography
                    sx={{ fontWeight: "600", color: "#4F772D", fontSize: 10 }}
                  >
                    Admin
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" gap="0.5rem">
                  <img src={UserIcon} alt="" style={{ height: "1rem" }} />
                  <Typography
                    sx={{ fontWeight: "600", color: "#008080", fontSize: 10 }}
                  >
                    Member
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider
              sx={{
                backgroundColor: "balck",
                width: "100%",
                borderColor: "#EBECEF",
              }}
            />
          </Box>
        ))}
      </Stack>

    </Paper>
  );
};

export default MemeberList;
