import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CallHistoryChart = (props) => {
    const dayTotals = props?.callSummary;
    return (
        <Box position='relative'>
            <Button
                sx={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    color: "black",
                    backgroundColor: "#F1F2F4",
                    borderRadius: "50px",
                    padding: "0.3rem 1rem",
                }}
                endIcon={<ExpandMoreIcon />}>
                Daily
            </Button>
            <BarChart
                series={[
                    {
                        data: dayTotals?.Incomming,
                        stack: "Calls",
                        label: "Incoming Calls",
                        color: "#4F772D",
                    },
                    {
                        data: dayTotals?.Outgoing,
                        stack: "Calls",
                        label: "Outgoing Calls",
                        color: "#8BA873",
                    },
                    {
                        data: dayTotals?.Missed,
                        stack: "Calls",
                        label: "Missed Calls",
                        color: "#E81313",
                    },
                ]}
                xAxis={[
                    {
                        data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        scaleType: "band",
                        categoryGapRatio: 0.55,
                        barGapRatio: 0.1,
                        tickLabelStyle: {
                            textAnchor: "start",
                            fontSize: 12,
                            color: "#ABB1BA",
                        },
                        color: "#ABB1BA",
                    },
                ]}
                leftAxis={null}
                width={800}
                height={350}
                slotProps={{
                    legend: {
                        position: {
                            vertical: "top",
                            horizontal: "left",
                        },
                        itemMarkWidth: 13,
                        itemMarkHeight: 13,
                        markGap: 5,
                        itemGap: 10,
                    },
                }}
            />
        </Box>
    );
};

export default CallHistoryChart;
