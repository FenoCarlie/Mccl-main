import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { Tabs } from "@mui/material";
import { Tab } from "@mui/material";
import { makeStyles } from "@mui/styles";

// Define custom styles
const useStyles = makeStyles({
  customTab: {
    backgroundColor: "#e0f7fa",
    color: "#006064",
    "&.Mui-selected": {
      backgroundColor: "#006064",
      color: "#e0f7fa",
    },
  },
});

export default function InfoTp() {
  const classes = useStyles();
  const { TpId } = useParams();
  const [getIn, setGetIn] = useState([]);
  const [getOut, setGetOut] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getGetIn = (TpId) => {
    axios
      .get(`http://localhost:8081/stockage/getIn/${TpId}`)
      .then(({ data }) => {
        setGetIn(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };

  const getGetOut = (TpId) => {
    axios
      .get(`http://localhost:8081/stockage/getOut/${TpId}`)
      .then(({ data }) => {
        setGetOut(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getGetOut(TpId);
    getGetIn(TpId);
  }, [TpId]);

  return (
    <div className="tp">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab className={classes.customTab} label="Get In" />
          <Tab className={classes.customTab} label="Get Out" />
        </Tabs>

        {activeTab === 0 && <h2>Content for Get In</h2>}
        {activeTab === 1 && <h2>Content for Get Out</h2>}
      </Box>
    </div>
  );
}
