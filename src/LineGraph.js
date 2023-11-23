import _debounce from "lodash/debounce";
import { useState, useRef, useReducer, useEffect } from "react";
import { CgAddR } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ThemeProvider } from "@emotion/react";
import InfoIcon from "@material-ui/icons/Info";

import LineGraphCanvas from "./LineGraphCanvas.js";
import "./lineGraph.css";

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
  InputAdornment,
  Collapse,
  Tooltip,
  IconButton,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";

import PinkAndWhiteTheme from "./themes/PinkAndWhiteTheme.js";
import utilitiesData from "./utilities.json";

const vectorColorPalettes = utilitiesData.vectorColorPalettes;
const vectorFontFamily = utilitiesData.vectorFontFamily;
const vectorFontSizes = utilitiesData.vectorFontSizes;
var globalMin = 920;
var globalMax = 2920;

function LineGraph() {
  const handleResize = _debounce(() => {
    setCanvasSizeX(
      document.body.clientWidth > 1300
        ? document.body.clientWidth * 0.42
        : document.body.clientWidth > 767
        ? document.body.clientWidth * 0.8
        : document.body.clientWidth * 0.9
    );
    setCanvasSizeY(document.body.clientHeight * 0.4);
    var a = { ...scalesText };
    a.size =
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8;
    setScalesText(a);
    var b = { ...yValuesText };
    b.size =
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8;
    setYValuesText(b);
    var c = { ...xValuesText };
    c.size =
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8;
    setXValuesText(c);
    var d = { ...titleText };
    d.size =
      document.body.clientWidth > 1300
        ? 32
        : document.body.clientWidth > 767
        ? 24
        : 18;
    setTitleText(d);
  });
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const [colorPalette, setColorPalette] = useState(vectorColorPalettes[0]);
  const [theme, setTheme] = useState(PinkAndWhiteTheme);
  const canvasRef = useRef();

  useEffect(() => {
    for (const key in colorPalette.css)
      document.documentElement.style.setProperty(
        "--" + key,
        colorPalette.css[key]
      );
  });

  const initialFields = [
    {
      index: 1,
      lineGraphName: "Instagram",
      lineGraphColor: colorPalette.vectorFillColors[1],
      lineGraphYValues: [920, 1040, 1210],
      lineGraphCustomColor: colorPalette.vectorFillColors[1],
    },
    {
      index: 2,
      lineGraphName: "Facebook",
      lineGraphColor: colorPalette.vectorFillColors[2],
      lineGraphYValues: [2500, 2800, 2920],
      lineGraphCustomColor: colorPalette.vectorFillColors[2],
    },
    {
      index: 3,
      lineGraphName: "WhatsApp",
      lineGraphColor: colorPalette.vectorFillColors[3],
      lineGraphYValues: [1813, 2102, 2289],
      lineGraphCustomColor: colorPalette.vectorFillColors[3],
    },
  ];
  const [xValues, setXValues] = useState([2019, 2020, 2021]);
  function fieldsReducer(state, action) {
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            index: state.length + 1,
            lineGraphName: "",
            lineGraphColor: colorPalette.vectorFillColors[state.length + 1],
            lineGraphYValues: new Array(xValues.length).fill(0),
            lineGraphCustomColor:
              colorPalette.vectorFillColors[state.length + 1],
          },
        ];
      case "change":
        const { indexC, keyC, valueC } = action.payload;
        const newStateC = [...state];
        newStateC[indexC][keyC] = valueC;
        return newStateC;
      case "number":
        const { indexN, keyN, valueN, valueN2 } = action.payload;
        const newStateN = [...state];
        if (!isNaN(Number(valueN))) {
          newStateN[indexN][keyN][valueN2] = Number(valueN);
          globalMin = Math.min(globalMin, Number(valueN));
          globalMax = Math.max(globalMax, Number(valueN));
        }
        return newStateN;
      case "delete":
        const { indexD } = action.payload;
        const stateD = [...state];
        stateD.splice(indexD - 1, 1);
        stateD.forEach((element, index) => {
          element.index = index + 1;
        });
        return stateD;
      case "addX":
        const newStateAX = [...state];
        newStateAX.forEach((element) => {
          while (element.lineGraphYValues.length < xValues.length)
            element.lineGraphYValues.push(0);
        });
        return newStateAX;
      case "deleteX":
        const { indexDX } = action.payload;
        const newStateDX = [...state];
        newStateDX.forEach((element) => {
          element.lineGraphYValues.splice(indexDX, 1);
        });
        return newStateDX;
      default:
        return state;
    }
  }
  const [fields, fieldsDispatch] = useReducer(fieldsReducer, initialFields);
  const [unusedMin, setUnusedMin] = useState("");
  const [unusedMax, setUnusedMax] = useState("");

  const [boolDisplayXLines, setBoolDisplayXLines] = useState(true);
  const [boolDisplayYLines, setBoolDisplayYLines] = useState(false);
  const [boolCustomColors, setBoolCustomColors] = useState(false);
  const [boolDisplayNames, setBoolDisplayNames] = useState(false);
  const [boolDisplayLines, setBoolDisplayLines] = useState(false);
  const [boolDisplayOptions, setBoolDisplayOptions] = useState(false);

  const [canvasSizeX, setCanvasSizeX] = useState(
    document.body.clientWidth > 1300
      ? document.body.clientWidth * 0.42
      : document.body.clientWidth > 767
      ? document.body.clientWidth * 0.8
      : document.body.clientWidth * 0.9
  );

  const [canvasSizeY, setCanvasSizeY] = useState(
    document.body.clientHeight * 0.4
  );
  const [canvasColor, setCanvasColor] = useState(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--canvasContainerColor"
    )
  );
  const [xName, setXName] = useState("Year");
  const [yName, setYName] = useState("Platform");

  const [lineGraphTitle, setLineGraphTitle] = useState(
    "User growth by platform(in milions)"
  );
  const [xValuesText, setXValuesText] = useState({
    font: "Arial",
    size:
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8,
    color: "black",
  });
  const [yValuesText, setYValuesText] = useState({
    font: "Arial",
    size:
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8,
    color: "black",
  });
  const [scalesText, setScalesText] = useState({
    font: "Arial",
    size:
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8,
    color: "black",
  });
  const [titleText, setTitleText] = useState({
    font: "Arial",
    size:
      document.body.clientWidth > 1300
        ? 32
        : document.body.clientWidth > 767
        ? 24
        : 18,
    color: "black",
  });

  const [line, setLine] = useState({ pointSize: 4, size: 4 });
  const [grid, setGrid] = useState({ size: 1, color: "grey" });
  const [customMin, setCustomMin] = useState(null);
  const [customMax, setCustomMax] = useState(null);

  const downloadCanvas = () => {
    const dataURL = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "canvas_image.png";
    a.click();
  };

  const loadTheme = async (themeName) => {
    let themeModule;

    try {
      themeModule = await import(`./themes/${themeName}.js`);
    } catch (error) {
      console.error("Error loading theme:", error);
    }

    if (themeModule) {
      setTheme(themeModule.default);
    }
  };

  function changeColorPalette(newColorPalette) {
    loadTheme(newColorPalette.themeString);
    setColorPalette(newColorPalette);
    fields.forEach((element) => {
      fieldsDispatch({
        type: "change",
        payload: {
          indexC: element.index - 1,
          keyC: "lineGraphColor",
          valueC: newColorPalette.vectorFillColors[element.index],
        },
      });
      fieldsDispatch({
        type: "change",
        payload: {
          indexC: element.index - 1,
          keyC: "lineGraphCustomColor",
          valueC: newColorPalette.vectorFillColors[element.index],
        },
      });
    });

    for (const key in newColorPalette.css)
      document.documentElement.style.setProperty(
        "--" + key,
        newColorPalette.css[key]
      );
  }

  function handleMax(e) {
    if (e.target.value === "") {
      setCustomMax(null);
      return;
    }
    if (!isNaN(Number(e.target.value)) && Number(e.target.value) >= globalMax) {
      setCustomMax(Number(e.target.value));
    } else setCustomMax(undefined);
  }

  function handleMin(e) {
    if (e.target.value === "") {
      setCustomMin(null);
      return;
    }
    if (!isNaN(Number(e.target.value)) && Number(e.target.value) <= globalMin) {
      setCustomMin(Number(e.target.value));
    } else setCustomMin(undefined);
  }

  const createNewField = () => {
    globalMin = 0;
    document.documentElement.style.setProperty(
      "--barGraphFormSize",
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--barGraphFormSize"
        )
      ) + 9
    );
    fieldsDispatch({ type: "add" });
  };

  function createXValue() {
    globalMin = 0;
    setXValues((prevXValues) => [
      ...prevXValues,
      prevXValues[prevXValues.length - 1] + 1,
    ]);
    fieldsDispatch({ type: "addX" });
  }
  function deleteField(ind) {
    document.documentElement.style.setProperty(
      "--barGraphFormSize",
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--barGraphFormSize"
        )
      ) - 9
    );
    var deletedColor = fields[ind - 1].lineGraphColor;
    setColorPalette((prevColorPalette) => {
      const newColorPalette = { ...prevColorPalette };
      newColorPalette.vectorFillColors.splice(
        newColorPalette.vectorFillColors.indexOf(deletedColor),
        1
      );
      newColorPalette.vectorFillColors.splice(fields.length, 0, deletedColor);
      return newColorPalette;
    });
    fieldsDispatch({ type: "delete", payload: { indexD: ind } });
  }
  function deleteXValue(ind) {
    setXValues((prevXValues) => {
      const newXValues = [...prevXValues];
      newXValues.splice(ind, 1);
      return newXValues;
    });
    fieldsDispatch({ type: "deleteX", payload: { indexDX: ind } });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="lineGraphForm">
        <h2>Graph Details</h2>
        <div className="titleAndPalette">
          <TextField
            size={document.body.clientWidth > 767 ? "medium" : "small"}
            className="titleInput"
            label="Title"
            value={lineGraphTitle}
            onChange={(e) => setLineGraphTitle(e.target.value)}
          ></TextField>
          <FormControl>
            <InputLabel>Color pallette</InputLabel>
            <Select
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              label="colorPalette"
              value={colorPalette.name}
              onChange={(e) => {
                changeColorPalette(
                  vectorColorPalettes.find((obj) => obj.name === e.target.value)
                );
              }}
            >
              {vectorColorPalettes.map((cp) => (
                <MenuItem key={cp.index} value={cp.name}>
                  {cp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="fieldsContainer">
          <div className="inputValue">
            <div className="topRightcorner"></div>
            {fields.map((field) => (
              <div key={field.index} className="xInput">
                <div className="xInputAndColor">
                  <Input
                    placeholder="Trend line name"
                    value={field.lineGraphName}
                    onChange={(e) =>
                      fieldsDispatch({
                        type: "change",
                        payload: {
                          indexC: field.index - 1,
                          keyC: "lineGraphName",
                          valueC: e.target.value,
                        },
                      })
                    }
                  />
                  {boolCustomColors ? (
                    <MuiColorInput
                      size={
                        document.body.clientWidth > 767 ? "medium" : "small"
                      }
                      label="Line color"
                      value={field.lineGraphCustomColor}
                      onChange={(newValue) =>
                        fieldsDispatch({
                          type: "change",
                          payload: {
                            indexC: field.index - 1,
                            keyC: "lineGraphCustomColor",
                            valueC: newValue,
                          },
                        })
                      }
                    />
                  ) : null}
                </div>
                <FaTrash
                  className="xInputTrash myAdd"
                  onClick={() =>
                    fields.length !== 1 ? deleteField(field.index) : null
                  }
                />
              </div>
            ))}
            <CgAddR
              className="myAdd lastItem"
              onClick={() => createNewField()}
            />
          </div>

          <div className="inputValues">
            {xValues.map((xValue, index) => (
              <div key={index} className="inputValue">
                <Input
                  placeholder="Interval marker"
                  value={xValue}
                  onChange={(e) => {
                    var a = [...xValues];
                    a[index] = Number(e.target.value);
                    setXValues(a);
                  }}
                />
                {fields.map((field) => (
                  <TextField
                    size={document.body.clientWidth > 767 ? "medium" : "small"}
                    value={field.lineGraphYValues[index]}
                    onChange={(e) =>
                      fieldsDispatch({
                        type: "number",
                        payload: {
                          indexN: field.index - 1,
                          keyN: "lineGraphYValues",
                          valueN: e.target.value,
                          valueN2: index,
                        },
                      })
                    }
                    key={field.index}
                  />
                ))}
                <FaTrash
                  className="myAdd lastItem"
                  onClick={() =>
                    xValues.length !== 2 ? deleteXValue(index) : null
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="titleAndPalette">
          <div>
            <p style={{ display: "inline" }}>Add horizontal value</p>
            <CgAddR className="myAdd" onClick={() => createXValue()} />
          </div>
          <FormControlLabel
            className="myLabel"
            control={
              <Checkbox
                className="myCheckbox"
                checked={boolCustomColors}
                onChange={() => {
                  setBoolCustomColors(!boolCustomColors);
                }}
              />
            }
            label="Custom colors"
          />
        </div>
        <div
          className="showOptions"
          onClick={() => setBoolDisplayOptions(!boolDisplayOptions)}
        >
          <div>
            <p style={{ display: "inline" }}>Show options</p>{" "}
            <IoIosArrowDown className="myAdd" />
          </div>
        </div>
        <Collapse in={boolDisplayOptions} className="optionsContainer">
          <div className="lgNonTextOptions">
            <div className="optionSection">
              <h4>Canvas options</h4>
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Canvas width"
                value={canvasSizeX}
                onChange={(e) => {
                  setCanvasSizeX(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
              />
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Canvas height"
                value={canvasSizeY}
                onChange={(e) => {
                  setCanvasSizeY(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
              />
              <MuiColorInput
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Canvas color"
                value={canvasColor}
                onChange={(newValue) => {
                  setCanvasColor(newValue);
                  document.documentElement.style.setProperty(
                    "--canvasContainerColor",
                    newValue
                  );
                }}
              />
              <Button
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                variant="outlined"
                onClick={() => {
                  setCanvasSizeX(
                    document.body.clientWidth > 1300
                      ? document.body.clientWidth * 0.42
                      : document.body.clientWidth > 767
                      ? document.body.clientWidth * 0.8
                      : document.body.clientWidth * 0.9
                  );
                  setCanvasSizeY(document.body.clientHeight * 0.4);
                }}
              >
                Resize to normal
              </Button>
            </div>
            <div className="optionSection">
              <h4>Grid options</h4>
              <FormControlLabel
                className="myLabel"
                control={
                  <Checkbox
                    className="myCheckbox"
                    checked={boolDisplayXLines}
                    onChange={() => setBoolDisplayXLines(!boolDisplayXLines)}
                  />
                }
                label="Show horizontal lines"
              />
              <FormControlLabel
                checked={boolDisplayYLines}
                className="myLabel"
                control={
                  <Checkbox
                    className="myCheckbox"
                    checked={boolDisplayYLines}
                    onChange={() => setBoolDisplayYLines(!boolDisplayYLines)}
                  />
                }
                label="Show vertical lines"
              />
              <MuiColorInput
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                disabled={!boolDisplayXLines && !boolDisplayYLines}
                label="Grid color"
                value={grid.color}
                onChange={(newValue) => {
                  var a = { ...grid };
                  a.color = newValue;
                  setGrid(a);
                }}
              />
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                disabled={!boolDisplayXLines && !boolDisplayYLines}
                label="Grid width"
                value={grid.size}
                onChange={(e) => {
                  var a = { ...grid };
                  a.size = e.target.value;
                  if (!isNaN(Number(e.target.value))) setGrid(a);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
              />
              <Button
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                disabled={!boolDisplayXLines && !boolDisplayYLines}
                variant="outlined"
                onClick={() => setGrid({ size: 1, color: "grey" })}
              >
                Reset to default
              </Button>
            </div>
            <div className="optionSection">
              <h4>Axis options</h4>
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Horizontal Axis Label"
                value={xName}
                onChange={(e) => {
                  setXName(e.target.value);
                }}
              />
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Vertical Axis Label"
                value={yName}
                onChange={(e) => {
                  setYName(e.target.value);
                }}
              />
              <FormControlLabel
                className="myLabel"
                control={
                  <Checkbox
                    className="myCheckbox"
                    checked={boolDisplayNames}
                    onChange={() => setBoolDisplayNames(!boolDisplayNames)}
                  />
                }
                label="Show labels"
              />
              <div style={{ display: "flex" }}>
                <FormControlLabel
                  className="myLabel"
                  control={
                    <Checkbox
                      className="myCheckbox"
                      checked={boolDisplayLines}
                      onChange={() => setBoolDisplayLines(!boolDisplayLines)}
                    />
                  }
                  label="Show axes"
                />
                <Tooltip title="Show otrogonal axes (axes that go trhough the origin)">
                  <IconButton className="myInfo">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="optionSection">
              <h4>Trend line options</h4>
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Line width"
                value={line.size}
                onChange={(e) => {
                  var a = { ...line };
                  a.size = e.target.value;
                  if (!isNaN(Number(e.target.value))) setLine(a);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
              />
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Point size"
                value={line.pointSize}
                onChange={(e) => {
                  var a = { ...line };
                  a.pointSize = e.target.value;
                  if (!isNaN(Number(e.target.value))) setLine(a);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
              />
              <Button
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                variant="outlined"
                onClick={() => setLine({ pointSize: 4, size: 4 })}
              >
                Reset to default
              </Button>
            </div>
            <div className="optionSection">
              <h4 style={{ display: "flex" }}>
                Custom range
                <Tooltip title="Ensure that the highest boundary exceeds the bar values and the lowest boundary falls below the lowest bar value. This practice is strongly discouraged and may lead to unexpected behavior.">
                  <IconButton className="myInfo">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </h4>
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                error={customMin === undefined}
                helperText={
                  customMin === undefined
                    ? "Please select a value lower than " + globalMin
                    : null
                }
                value={unusedMin}
                onChange={(e) => setUnusedMin(e.target.value)}
                label="Lowest value"
                onBlur={(e) => handleMin(e)}
              />
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                value={unusedMax}
                error={customMax === undefined}
                helperText={
                  customMax === undefined
                    ? "Please select a value higher than " + globalMax
                    : null
                }
                onChange={(e) => setUnusedMax(e.target.value)}
                label="Highest value"
                onBlur={(e) => handleMax(e)}
              />
              <Button
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                variant="outlined"
                onClick={() => {
                  setCustomMax(null);
                  setCustomMin(null);
                  setUnusedMax("");
                  setUnusedMin("");
                }}
              >
                Delete custom values
              </Button>
            </div>
          </div>
          <div className="textHeader">
            <h2>Text options</h2>
          </div>
          <div className="textOptions">
            <p>Horizontal values</p>
            <MuiColorInput
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              label="Horizontal values color"
              value={xValuesText.color}
              onChange={(newValue) => {
                var a = { ...xValuesText };
                a.color = newValue;
                setXValuesText(a);
              }}
            />
            <FormControl>
              <InputLabel>Horizontal values size</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Horizontal values size"
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
              <InputLabel>Horizontal values font</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Horizontal values font"
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
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              variant="outlined"
              onClick={() =>
                setXValuesText({
                  font: "Arial",
                  size:
                    document.body.clientWidth > 1300
                      ? 12
                      : document.body.clientWidth > 767
                      ? 10
                      : 8,
                  color: "black",
                })
              }
            >
              Reset to default
            </Button>
            <p>Vertical values</p>
            <MuiColorInput
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              label="Vertical values color"
              value={yValuesText.color}
              onChange={(newValue) => {
                var a = { ...yValuesText };
                a.color = newValue;
                setYValuesText(a);
              }}
            />
            <FormControl>
              <InputLabel>Vertical values size</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Vertical values font"
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
              <InputLabel>Vertical values font</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Vertical values font"
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
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              variant="outlined"
              onClick={() =>
                setYValuesText({
                  font: "Arial",
                  size:
                    document.body.clientWidth > 1300
                      ? 12
                      : document.body.clientWidth > 767
                      ? 10
                      : 8,
                  color: "black",
                })
              }
            >
              Reset to default
            </Button>
            <p>Scales</p>
            <MuiColorInput
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              label="Scales color"
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
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Scales size"
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
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Scales font"
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
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              variant="outlined"
              onClick={() =>
                setScalesText({
                  font: "Arial",
                  size:
                    document.body.clientWidth > 1300
                      ? 12
                      : document.body.clientWidth > 767
                      ? 10
                      : 8,
                  color: "black",
                })
              }
            >
              Reset to default
            </Button>
            <p>Title</p>
            <MuiColorInput
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              label="Title color"
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
                size={document.body.clientWidth > 767 ? "medium" : "small"}
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
                size={document.body.clientWidth > 767 ? "medium" : "small"}
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
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              className="myButton"
              variant="outlined"
              onClick={() =>
                setTitleText({
                  font: "Arial",
                  size:
                    document.body.clientWidth > 1300
                      ? 32
                      : document.body.clientWidth > 767
                      ? 24
                      : 18,
                  color: "black",
                })
              }
            >
              Reset to default
            </Button>
          </div>
        </Collapse>
      </div>
      <div className="canvasContainer">
        <LineGraphCanvas
          ref={canvasRef}
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
        <Button
          variant="contained"
          className="myButton downloadButton"
          onClick={() => {
            downloadCanvas();
          }}
        >
          Download the Line Graph now
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default LineGraph;
