import { useState, useRef } from "react";
import { CgAddR } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ThemeProvider } from "@emotion/react";

import LineGraphCanvas from "./LineGraphCanvas.js";
import "./lineGraphCanvas.css";

import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItem,
  InputAdornment,
  Collapse,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";

import PinkAndWhiteTheme from "./themes/PinkAndWhiteTheme.js";
import utilitiesData from "./utilities.json";

const vectorColorPalettes = utilitiesData.vectorColorPalettes;
const vectorFontFamily = utilitiesData.vectorFontFamily;
const vectorFontSizes = utilitiesData.vectorFontSizes;

var vectorFillColors = [
  "0",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#C0C0C0",
  "#808080",
  "#800000",
  "#808000",
  "#008000",
  "#800080",
  "#008080",
  "#000080",
  "#FFFFFF",
];

function LineGraph() {
  const [colorPalette, setColorPalette] = useState(vectorColorPalettes[0]);
  const [theme,setTheme] = useState(PinkAndWhiteTheme);
  const canvasRef = useRef();
  

  var minRef = useRef(null);
  var maxRef = useRef(null);

  var globalMin = 21;
  var globalMax = 56;

  const initialFields = [
    {
      index: 1,
      lineGraphName: "Big mac",
      lineGraphColor: "#ff0000",
      lineGraphYValues: [51, 43, 21],
      lineGraphCustomColor: "#ff0000",
    },
    {
      index: 2,
      lineGraphName: "Lipton",
      lineGraphColor: "#00ff00",
      lineGraphYValues: [49, 32, 56],
      lineGraphCustomColor: "#00ff00",
    },
  ];

  const [fields, setFields] = useState(initialFields);
  const [xValues, setXValues] = useState([2019, 2020, 2021]);

  const [boolDisplayXLines, setBoolDisplayXLines] = useState(true);
  const [boolDisplayYLines, setBoolDisplayYLines] = useState(false);
  const [boolCustomColors, setBoolCustomColors] = useState(false);
  const [boolDisplayNames, setBoolDisplayNames] = useState(false);
  const [boolDisplayLines, setBoolDisplayLines] = useState(false);

  const [canvasSizeX, setCanvasSizeX] = useState(600);
  const [canvasSizeY, setCanvasSizeY] = useState(300);
  const [canvasColor, setCanvasColor] = useState("white");
  const [xName, setXName] = useState("Year");
  const [yName, setYName] = useState("Price");

  const [lineGraphTitle, setLineGraphTitle] = useState("Price growth of a product");
  const [xValuesText, setXValuesText] = useState({
    font: "Arial",
    size: 12,
    color: "black",
  });
  const [yValuesText, setYValuesText] = useState({
    font: "Arial",
    size: 12,
    color: "black",
  });
  const [scalesText, setScalesText] = useState({
    font: "Arial",
    size: 12,
    color: "black",
  });
  const [titleText, setTitleText] = useState({
    font: "Arial",
    size: 32,
    color: "black",
  });

  const [line, setLine] = useState({ pointSize: 3, size: 1 });
  const [grid, setGrid] = useState({ size: 1, color: "black" });
  const [customMin, setCustomMin] = useState(null);
  const [customMax, setCustomMax] = useState(null);

  function handleMax(e) {
    if (e.target.value === "") {
      setCustomMax(null);
      return;
    }
    if (!isNaN(Number(e.target.value)) && Number(e.target.value) >= globalMax) {
      setCustomMax(Number(e.target.value));
    } else alert("Choose a number greater than " + globalMax);
  }

  function handleMin(e) {
    if (e.target.value === "") {
      setCustomMin(null);
      return;
    }
    if (!isNaN(Number(e.target.value)) && Number(e.target.value) <= globalMin) {
      setCustomMin(Number(e.target.value));
    } else alert("Choose a number smaller than " + globalMin);
  }

  const handleInputChange = (index, key, value) => {
    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index][key] = value;
      return newFields;
    });
  };

  const handleInputChangeNumber = (index, key, value, index2) => {
    setFields((prevFields) => {
      const newFields = [...prevFields];
      if (!isNaN(Number(value))) {
        newFields[index][key][index2] = Number(value);
        globalMin = Math.min(globalMin, Number(value));
        globalMax = Math.max(globalMax, Number(value));
      }
      return newFields;
    });
  };

  const createNewField = () => {
    setFields((prevFields) => [
      ...prevFields,
      {
        index: prevFields.length + 1,
        lineGraphName: "",
        lineGraphColor: vectorFillColors[prevFields.length + 1],
        lineGraphYValues: new Array(xValues.length).fill(0),
        lineGraphCustomColor: vectorFillColors[prevFields.length + 1],
      },
    ]);
  };

  function createXValue() {
    setXValues((prevXValues) => [...prevXValues, 0]);
    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.forEach((element) => {
        while (element.lineGraphYValues.length <= xValues.length)
          element.lineGraphYValues.push(0);
      });
      return newFields;
    });
  }
  function deleteField(ind) {
    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.splice(ind - 1, 1);
      newFields.forEach((element, index) => {
        element.index = index + 1;
      });

      return newFields;
    });
  }

  function deleteXValue(ind) {
    setXValues((prevXValues) => {
      const newXValues = [...prevXValues];
      newXValues.splice(ind, 1);
      return newXValues;
    });
    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.forEach((element) => {
        element.lineGraphYValues.splice(ind, 1);
      });
      return newFields;
    });
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="lineGraphContainer">
      <div className="lineGraphForm">
        <TextField
          label="Title:(optional)"
          value={lineGraphTitle}
          onChange={(e) => setLineGraphTitle(e.target.value)}
        ></TextField>
        {fields.map((field) => (
          <div>
            <Input
              className="lineGraphYValue"
              value={field.lineGraphName}
              onChange={(e) =>
                handleInputChange(
                  field.index - 1,
                  "lineGraphName",
                  e.target.value
                )
              }
            />
            {boolCustomColors ? (
              <MuiColorInput
                label="Line color"
                value={field.lineGraphCustomColor}
                onChange={(e) =>
                  handleInputChange(
                    field.index - 1,
                    "lineGraphCustomColor",
                    e.target.value
                  )
                }
              />
            ) : null}
            <FaTrash
              onClick={() =>
                fields.length !== 1 ? deleteField(field.index) : null
              }
            />
          </div>
        ))}
        <CgAddR onClick={() => createNewField()} />
        {xValues.map((xValue, index) => (
          <div key={index}>
            {" "}
            Field {xValue.index}
            <Input
              className="lineGraphXValue"
              value={xValue}
              onChange={(e) => {
                var a = [...xValues];
                a[index] = Number(e.target.value);
                setXValues(a);
              }}
            />
            {fields.map((field) => (
              <Input
                className="lineGraphYValue"
                value={field.lineGraphYValues[index]}
                onChange={(e) =>
                  handleInputChangeNumber(
                    field.index - 1,
                    "lineGraphYValues",
                    e.target.value,
                    index
                  )
                }
                key={field.index}
              />
            ))}
            <FaTrash
              onClick={() =>
                xValues.length !== 2 ? deleteXValue(index) : null
              }
            />
          </div>
        ))}
        <CgAddR onClick={() => createXValue()} />
        <FormControlLabel
          control={
            <Checkbox
          checked={boolDisplayXLines}
          onChange={() => setBoolDisplayXLines(!boolDisplayXLines)}
        />}
        label="Display X lines"
      />

        <FormControlLabel
          control={
            <Checkbox
          checked={boolDisplayYLines}
          onChange={() => setBoolDisplayYLines(!boolDisplayYLines)}
        />}
        label="Display Y lines"
      />
        <MuiColorInput
          label="Grid color"
          value={grid.color}
          onChange={(e) => {
            var a = { ...grid };
            a.color = e.target.value;
            setGrid(a);
          }}
        />
        <TextField
          label="stroke width"
          value={grid.size}
          onChange={(e) => {
            var a = { ...grid };
            a.size = e.target.value;
            if (!isNaN(Number(e.target.value))) setGrid(a);
          }}
        />
        <Button
          variant="outlined"
          onClick={() => setGrid({ size: 1, color: "black" })}
        >
          {" "}
          Reset to default
        </Button>
        <br></br>
        
        <FormControlLabel
          control={
            <Checkbox
          onClick={() => {
            setBoolCustomColors(!boolCustomColors);
          }}
        />}
        label="Custom colors"
      />
        <br></br>
        <TextField
          label="Custom x"
          value={canvasSizeX}
          onChange={(e) => {
            setCanvasSizeX(e.target.value);
          }}
        />
        <TextField
          label="Custom y"
          value={canvasSizeY}
          onChange={(e) => {
            setCanvasSizeY(e.target.value);
          }}
        />
        <MuiColorInput
          label= "Canvas color"
          value={canvasColor}
          onChange={newValue => setCanvasColor(newValue)}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setCanvasSizeX(600);
            setCanvasSizeY(300);
          }}
        >
          {" "}
          Resize to normal
        </Button>
        <br></br>
        <TextField
          label="Name x"
          value={xName}
          onChange={(e) => {
            setXName(e.target.value);
          }}
        />
        <TextField
          label="Name y"
          value={yName}
          onChange={(e) => {
            setYName(e.target.value);
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={boolDisplayNames}
              onChange={() => setBoolDisplayNames(!boolDisplayNames)}
            />
          }
          label="Display names"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={boolDisplayLines}
              onChange={() => setBoolDisplayLines(!boolDisplayLines)}
            />
          }
          label="Display lines"
        />
        <br></br>
        <TextField
          label="Custom min"
          ref={minRef}
          onBlur={(e) => handleMin(e)}
        />
        <TextField
          label="Custom max"
          ref={maxRef}
          onBlur={(e) => handleMax(e)}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setCustomMax(null);
            setCustomMin(null);
            minRef.current.value = null;
            maxRef.current.value = null;
          }}
        >
          {" "}
          Delete custom values
        </Button>
        <br></br>
        <p>Customize X value</p>
        <MuiColorInput
          label="X values color"
          value={xValuesText.color}
          onChange={(newValue) => {
            var a = { ...xValuesText };
            a.color = newValue;
            setXValuesText(a);
          }}
        />
        <FormControl>
          <InputLabel>Y values size</InputLabel>
          <Select
            value={xValuesText.size}
            onChange={(e) => {
              var a = { ...xValuesText };
              a.size = e.target.value;
              setXValuesText(a);
            }}
          >
            {vectorFontSizes.map((size, index) => (
              <MenuItem key={index} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Y values font</InputLabel>
          <Select
            value={xValuesText.font}
            onChange={(e) => {
              var a = { ...xValuesText };
              a.font = e.target.value;
              setXValuesText(a);
            }}
          >
            {vectorFontFamily.map((font, index) => (
              <MenuItem key={index} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() =>
            setXValuesText({ font: "Arial", size: 12, color: "black" })
          }
        >
          {" "}
          Reset to default
        </Button>
        <br></br>
        Customize Y value{" "}
        <MuiColorInput
          label="Y values color"
          value={yValuesText.color}
          onChange={(newValue) => {
            var a = { ...yValuesText };
            a.color = newValue;
            setYValuesText(a);
          }}
        />
        <FormControl>
          <InputLabel>Y values size</InputLabel>
          <Select
            value={yValuesText.size}
            onChange={(e) => {
              var a = { ...yValuesText };
              a.size = e.target.value;
              setYValuesText(a);
            }}
          >
            {vectorFontSizes.map((size, index) => (
              <MenuItem key={index} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Y values font</InputLabel>
          <Select
            value={yValuesText.font}
            onChange={(e) => {
              var a = { ...yValuesText };
              a.font = e.target.value;
              setYValuesText(a);
            }}
          >
            {vectorFontFamily.map((font, index) => (
              <MenuItem key={index} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() =>
            setYValuesText({ font: "Arial", size: 12, color: "black" })
          }
        >
          {" "}
          Reset to default
        </Button>
        <br></br>
        Customize scales{" "}
        <MuiColorInput
          label="scales color"
          value={scalesText.color}
          onChange={(newValue) => {
            var a = { ...scalesText };
            a.color = newValue;
            setScalesText(a);
          }}
        />
        <FormControl>
          <InputLabel>Scales size</InputLabel>
          <Select
            value={scalesText.size}
            onChange={(e) => {
              var a = { ...scalesText };
              a.size = e.target.value;
              if (!isNaN(Number(e.target.value))) setScalesText(a);
            }}
          >
            {vectorFontSizes.map((size, index) => (
              <MenuItem key={index} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Scales font</InputLabel>
          <Select
            value={scalesText.font}
            onChange={(e) => {
              var a = { ...scalesText };
              a.font = e.target.value;
              setScalesText(a);
            }}
          >
            {vectorFontFamily.map((font, index) => (
              <MenuItem key={index} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() =>
            setScalesText({ font: "Arial", size: 12, color: "black" })
          }
        >
          {" "}
          Reset to default
        </Button>
        <br></br>
        <p>title text</p>
        <MuiColorInput
          label="title color"
          value={titleText.color}
          onChange={(newValue) => {
            var a = { ...titleText };
            a.color = newValue;
            setTitleText(a);
          }}
        />
        <FormControl>
          <InputLabel>Title size</InputLabel>
          <Select
            label="Title size"
            value={titleText.size}
            onChange={(e) => {
              var a = { ...titleText };
              a.size = e.target.value;
              if (!isNaN(Number(e.target.value))) setTitleText(a);
            }}
          >
            {vectorFontSizes.map((size, index) => (
              <MenuItem key={index} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Title font</InputLabel>
          <Select
            label="Title font"
            value={titleText.font}
            onChange={(e) => {
              var a = { ...titleText };
              a.font = e.target.value;
              setTitleText(a);
            }}
          >
            {vectorFontFamily.map((font, index) => (
              <MenuItem key={index} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          className="myButton"
          variant="outlined"
          onClick={() =>
            setTitleText({ font: "Arial", size: 28, color: "black" })
          }
        >
          Reset to default
        </Button>
        <br></br>
        <p>customize line</p>
        <TextField
          label="line width"
          value={line.size}
          onChange={(e) => {
            var a = { ...line };
            a.size = e.target.value;
            if (!isNaN(Number(e.target.value))) setLine(a);
          }}
        />
        <TextField
          label="circle size"
          value={line.pointSize}
          onChange={(e) => {
            var a = { ...line };
            a.pointSize = e.target.value;
            if (!isNaN(Number(e.target.value))) setLine(a);
          }}
        />
        <Button
          variant="outlined"
          onClick={() => setLine({ pointSize: 3, size: 1 })}
        >
          {" "}
          Reset to default
        </Button>
        <br></br>
      </div>
      <LineGraphCanvas
        fieldsObejct={fields}
        boolDisplayXLines={boolDisplayXLines}
        boolDisplayYLines={boolDisplayYLines}
        title={lineGraphTitle}
        canvasSizeX={canvasSizeX}
        canvasSizeY={canvasSizeY}
        xValues={xValues}
        xValuesText={xValuesText}
        yValuesText={yValuesText}
        scalesText={scalesText}
        line={line}
        xName={xName}
        yName={yName}
        titleText={titleText}
        customMax={customMax}
        customMin={customMin}
        grid={grid}
        boolCustomColors={boolCustomColors}
        boolDisplayNames={boolDisplayNames}
        boolDisplayLines={boolDisplayLines}
        canvasColor={canvasColor}
      />
    </div>
    </ThemeProvider>
  );
}

export default LineGraph;
