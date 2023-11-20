import {
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import Graph from "./Graph.js";
import { useState } from "react";
import "./startPage.css";
import { useRef } from "react";
import "./graph.css";

function StartPage() {
  const [graphString, setgraphString] = useState(null);
  const [graphType, setgraphType] = useState("lineGraph");
  const selectRef = useRef(null);
  return (
    <div id="wholePage">
      <div id="mainPage">
        <div id="mainSquareContainer">
          <div id="mainSquare">
            <h1>Design your own graph in seconds</h1>
            <p>
              Create stunning graphs effortlessly. Choose from a vast range of
              graphs. Customize your visuals with a range of options and vibrant
              color palettes. No payment or account needed.
            </p>

            <h3>Get started:</h3>
            <FormControl>
              <InputLabel>Select graph type</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                ref={selectRef}
                value={graphType}
                onChange={(e) => {
                  setgraphType(e.target.value);
                }}
                label="Select graph type"
              >
                <MenuItem value="pieChart">Pie Chart</MenuItem>
                <MenuItem value="barGraph">Bar Graph</MenuItem>
                <MenuItem value="lineGraph">Line Graph</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => {
                setgraphString(graphType);
                setTimeout(() => {
                    window.scrollTo({ top: document.body.clientHeight, behavior: 'smooth' });
                }, 100);
                
              }
            }
            >
              Create new graph
            </Button>
          </div>
        </div>
      </div>
      <Graph graphString={graphString} />
    </div>
  );
}

export default StartPage;
