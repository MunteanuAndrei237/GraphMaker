import _debounce from "lodash/debounce";
import { useState, useRef, useReducer, useEffect } from "react";
import { CgAddR } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ThemeProvider } from "@emotion/react";

import InfoIcon from "@material-ui/icons/Info";
import BarGraphCanvas from "./BarGraphCanvas.js";
import "./barGraph.css";

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
var globalMax = 180;
var globalMin = 160;
var globalMaxComposed = 185;
var globalMinComposed = 150;

function BarGraph() {
  const handleResize = _debounce(() => {
    setCanvasSizeX(
      document.body.clientWidth > 1300
        ? document.body.clientWidth * 0.42
        : document.body.clientWidth > 767
        ? document.body.clientWidth * 0.8
        : document.body.clientWidth * 0.9
    );
    setCanvasSizeY(document.body.clientHeight * 0.4);
    var a = fieldText;
    a.fieldTextSize =
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8;
    setFieldText(a);
    var b = fieldTextComposed;
    b.fieldTextSize =
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8;
    setFieldTextComposed(b);
    var c = fieldTextValue;
    c.fieldTextSize =
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8;
    setFieldTextValue(c);
    var d = fieldTextTitle;
    d.fieldTextSize =
      document.body.clientWidth > 1300
        ? 32
        : document.body.clientWidth > 767
        ? 24
        : 18;
    setFieldTextTitle(d);
    var e = fieldTextValueOnBar;
    e.fieldTextSize =
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8;
    setFieldTextValueOnBar(e);
  });

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const canvasRef = useRef();
  const [colorPalette, setColorPalette] = useState(vectorColorPalettes[0]);
  const [theme, setTheme] = useState(PinkAndWhiteTheme);

  useEffect(() => {
    for (const key in colorPalette.css)
      document.documentElement.style.setProperty(
        "--" + key,
        colorPalette.css[key]
      );
  });

  const initialComposed = [
    {
      index: 1,
      composedName: "female",
      composedColor: colorPalette.vectorFillColors[1],
      composedCustomColor: colorPalette.vectorFillColors[1],
    },
    {
      index: 2,
      composedName: "male",
      composedColor: colorPalette.vectorFillColors[2],
      composedCustomColor: colorPalette.vectorFillColors[2],
    },
  ];
  const initialFields = [
    {
      index: 1,
      barGraphName: "Netherlands",
      barGraphValue: 177,
      barGraphColor: colorPalette.vectorFillColors[1],
      barGraphArray: [170, 183],
      barGraphCustomColor: colorPalette.vectorFillColors[1],
    },
    {
      index: 2,
      barGraphName: "United states",
      barGraphValue: 170,
      barGraphColor: colorPalette.vectorFillColors[2],
      barGraphArray: [163, 177],
      barGraphCustomColor: colorPalette.vectorFillColors[2],
    },
    {
      index: 3,
      barGraphName: "Mexico",
      barGraphValue: 164,
      barGraphColor: colorPalette.vectorFillColors[3],
      barGraphArray: [157, 170],
      barGraphCustomColor: colorPalette.vectorFillColors[3],
    },
  ];
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
    fields.forEach((field) => {
      fieldsDispatch({
        type: "change",
        payload: {
          indexC: field.index - 1,
          keyC: "barGraphCustomColor",
          valueC: newColorPalette.vectorFillColors[field.index],
        },
      });
      fieldsDispatch({
        type: "change",
        payload: {
          indexC: field.index - 1,
          keyC: "barGraphColor",
          valueC: newColorPalette.vectorFillColors[field.index],
        },
      });
    });
    composed.forEach((field) => {
      composedDispatch({
        type: "change",
        payload: {
          indexC: field.index - 1,
          keyC: "composedCustomColor",
          valueC: newColorPalette.vectorFillColors[field.index],
        },
      });
      composedDispatch({
        type: "change",
        payload: {
          indexC: field.index - 1,
          keyC: "composedColor",
          valueC: newColorPalette.vectorFillColors[field.index],
        },
      });
    });
    for (const key in newColorPalette.css)
      document.documentElement.style.setProperty(
        "--" + key,
        newColorPalette.css[key]
      );
  }
  function composedReducer(state, action) {
    switch (action.type) {
      case "change":
        const { indexC, keyC, valueC } = action.payload;
        let newStateC = [...state];
        newStateC[indexC][keyC] = valueC;
        return newStateC;
      case "addComposed":
        const stateAC = [...state];
        stateAC.push({
          index: state.length + 1,
          composedName: "",
          composedColor: colorPalette.vectorFillColors[state.length + 1],
          composedCustomColor: colorPalette.vectorFillColors[state.length + 1],
        });
        return stateAC;
      case "deleteComposed":
        const { deleteIndex } = action.payload;

        const stateDC = [...state];
        stateDC.splice(deleteIndex, 1);
        stateDC.forEach((element, index) => {
          element.index = index + 1;
        });
        return stateDC;
      case "removeColor":
        const newStateR = [...state];
        newStateR.forEach((element) => {
          element.composedColor = colorPalette.vectorFillColors[element.index];
        });
        return newStateR;
      default:
        return state;
    }
  }

  function fieldsReducer(state, action) {
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            index: state.length + 1,
            barGraphName: "",
            barGraphValue: state[state.length - 1].barGraphValue + 1,
            barGraphColor: colorPalette.vectorFillColors[state.length + 1],
            barGraphArray: Array.from({ length: composed.length }, () => 0),
            barGraphCustomColor:
              colorPalette.vectorFillColors[state.length + 1],
          },
        ];
      case "change":
        const { indexC, keyC, valueC } = action.payload;
        let newStateC = [...state];
        newStateC[indexC][keyC] = valueC;
        return newStateC;
      case "number":
        const { indexN, keyN, valueN } = action.payload;
        let newStateN = [...state];
        if (!isNaN(Number(valueN))) {
          newStateN[indexN][keyN] = Number(valueN);
          globalMax = Math.max(globalMax, Number(valueN));
          globalMin = Math.min(globalMin, Number(valueN));
        }
        return newStateN;
      case "array":
        const { indexA, keyA, valueA, index2A } = action.payload;
        let newStateA = [...state];
        if (!isNaN(Number(valueA))) {
          newStateA[indexA][keyA][index2A] = Number(valueA);
          globalMaxComposed = Math.max(globalMaxComposed, Number(valueA));
          globalMinComposed = Math.min(globalMinComposed, Number(valueA));
        }
        return newStateA;
      case "delete":
        const { deleteIndex } = action.payload;
        let newStateD = [...state];
        newStateD.splice(deleteIndex - 1, 1);
        newStateD.forEach((element, index) => {
          element.index = index + 1;
        });
        return newStateD;
      case "addComposed":
        let newStateAC = [...state];
        newStateAC.forEach((element) => {
          while (element.barGraphArray.length < composed.length)
            element.barGraphArray.push(0);
        });
        return newStateAC;
      case "deleteComposed":
        const { deleteComposedIndex } = action.payload;
        let newStateDC = [...state];
        newStateDC = state.map((element) => {
          const newBarGraphArray = [...element.barGraphArray];
          newBarGraphArray.splice(deleteComposedIndex, 1);
          return { ...element, barGraphArray: newBarGraphArray };
        });
        return newStateDC;
      case "removeColor":
        const newStateR = [...state];
        newStateR.forEach((element) => {
          element.barGraphColor = colorPalette.vectorFillColors[element.index];
        });
        return newStateR;

      default:
        return state;
    }
  }
  const [composed, composedDispatch] = useReducer(
    composedReducer,
    initialComposed
  );
  const [fields, fieldsDispatch] = useReducer(fieldsReducer, initialFields);

  const [unusedMin, setUnusedMin] = useState("");
  const [unusedMax, setUnusedMax] = useState("");

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
  const [canvasColor, setCanvasColor] = useState("white");
  const [customBarWidth, setCustomBarWidth] = useState(0);

  const [boolShowLines, setBoolShowLines] = useState(true);
  const [boolDisplayValueOnBar, setBoolDisplayValueOnBar] = useState(false);
  const [boolCustomColors, setBoolCustomColors] = useState(true);
  const [boolComposedValues, setBoolComposedValues] = useState(false);
  const [boolDisplayOptions, setBoolDisplayOptions] = useState(false);

  const [barGraphTitle, setBarGraphTitle] = useState(
    "Average height by country"
  );
  const [customMin, setCustomMin] = useState(null);
  const [customMax, setCustomMax] = useState(null);

  const [fieldText, setFieldText] = useState({
    fieldTextColor: "black",
    fieldTextSize:
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8,
    fieldTextFont: "Arial",
  });
  const [fieldTextComposed, setFieldTextComposed] = useState({
    fieldTextColor: "black",
    fieldTextSize:
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8,
    fieldTextFont: "Arial",
  });
  const [fieldTextValue, setFieldTextValue] = useState({
    fieldTextColor: "black",
    fieldTextSize:
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8,
    fieldTextFont: "Arial",
  });
  const [fieldTextTitle, setFieldTextTitle] = useState({
    fieldTextColor: "black",
    fieldTextSize:
      document.body.clientWidth > 1300
        ? 32
        : document.body.clientWidth > 767
        ? 24
        : 18,
    fieldTextFont: "Arial",
  });
  const [fieldTextValueOnBar, setFieldTextValueOnBar] = useState({
    fieldTextColor: "black",
    fieldTextSize:
      document.body.clientWidth > 1300
        ? 12
        : document.body.clientWidth > 767
        ? 10
        : 8,
    fieldTextFont: "Arial",
  });
  const [line, setLine] = useState({ color: "grey", size: 1 });

  function deleteField(ind) {
    var deletedColor = fields[ind - 1].barGraphColor;
    colorPalette.vectorFillColors.splice(
      colorPalette.vectorFillColors.indexOf(deletedColor),
      1
    );
    colorPalette.vectorFillColors.splice(fields.length, 0, deletedColor);
    fieldsDispatch({ type: "delete", payload: { deleteIndex: ind } });
  }

  function handleMax(e) {
    if (e.target.value === "") {
      setCustomMax(null);
      return;
    }
    if (!boolComposedValues) {
      if (
        !isNaN(Number(e.target.value)) &&
        Number(e.target.value) >= globalMax
      ) {
        setCustomMax(Number(e.target.value));
      } else {
        setCustomMax(undefined);
      }
    } else {
      if (
        !isNaN(Number(e.target.value)) &&
        Number(e.target.value) >= globalMaxComposed
      ) {
        setCustomMax(Number(e.target.value));
      } else setCustomMax(undefined);
    }
  }

  function handleMin(e) {
    if (e.target.value === "") {
      setCustomMin(null);
      return;
    }
    if (!boolComposedValues) {
      if (
        !isNaN(Number(e.target.value)) &&
        Number(e.target.value) <= globalMin
      ) {
        setCustomMin(Number(e.target.value));
      } else {
        setCustomMin(undefined);
      }
    } else {
      if (
        !isNaN(Number(e.target.value)) &&
        Number(e.target.value) <= globalMinComposed
      ) {
        setCustomMin(Number(e.target.value));
      } else setCustomMin(undefined);
    }
  }

  function deleteComposedField(ind) {
    var deletedColor = composed[ind].composedColor;
    colorPalette.vectorFillColors.splice(
      colorPalette.vectorFillColors.indexOf(deletedColor),
      1
    );
    colorPalette.vectorFillColors.splice(composed.length, 0, deletedColor);
    fieldsDispatch({
      type: "deleteComposed",
      payload: { deleteComposedIndex: ind },
    });
    composedDispatch({ type: "deleteComposed", payload: { deleteIndex: ind } });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="barGraphForm">
        <h2>Bar graph details</h2>
        <div className="titleAndPalette">
          <TextField
            size={document.body.clientWidth > 767 ? "medium" : "small"}
            className="titleInput"
            label="Title"
            placeholder="Yout title here"
            value={barGraphTitle}
            onChange={(e) => setBarGraphTitle(e.target.value)}
          />
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
          {boolComposedValues ? (
            <div className="bgInputValue">
              <div className="topRightcorner"></div>
              {composed.map((field, index) => (
                <div key={field.index} className="xInput">
                  <div className="xInputAndColor">
                    <Input
                      placeholder="group name"
                      value={field.composedName}
                      onChange={(e) => {
                        composedDispatch({
                          type: "change",
                          payload: {
                            indexC: index,
                            keyC: "composedName",
                            valueC: e.target.value,
                          },
                        });
                      }}
                    />
                    {boolCustomColors ? (
                      <MuiColorInput
                        size={
                          document.body.clientWidth > 767 ? "medium" : "small"
                        }
                        label="bar color"
                        value={field.composedCustomColor}
                        onChange={(newValue) => {
                          composedDispatch({
                            type: "change",
                            payload: {
                              indexC: index,
                              keyC: "composedCustomColor",
                              valueC: newValue,
                            },
                          });
                        }}
                      />
                    ) : null}
                  </div>
                  <FaTrash
                    className="xInputTrash myAdd "
                    onClick={() =>
                      composed.length > 2 ? deleteComposedField(index) : null
                    }
                  />
                </div>
              ))}
              <CgAddR
                className="myAdd lastItem"
                display="inline"
                onClick={() => {
                  fieldsDispatch({ type: "addComposed" });
                  composedDispatch({ type: "addComposed" });
                }}
              />
            </div>
          ) : (
            <div className="bgInputValue">
              <h4>Bar name</h4> <h4>Bar value</h4>
              {boolCustomColors ? <h4> Bar color</h4> : null} <h4>Delete</h4>
            </div>
          )}

          <div className="inputValues">
            {fields.map((field) => (
              <div key={field.index} className="bgInputValue">
                <Input
                  placeholder="Bar name"
                  value={field.barGraphName}
                  onChange={(e) =>
                    fieldsDispatch({
                      type: "change",
                      payload: {
                        indexC: field.index - 1,
                        keyC: "barGraphName",
                        valueC: e.target.value,
                      },
                    })
                  }
                />
                {!boolComposedValues ? (
                  <Input
                    placeholder="Bar value"
                    value={field.barGraphValue}
                    onChange={(e) =>
                      fieldsDispatch({
                        type: "number",
                        payload: {
                          indexN: field.index - 1,
                          keyN: "barGraphValue",
                          valueN: e.target.value,
                        },
                      })
                    }
                  />
                ) : (
                  composed.map((unused, composedIndex) => (
                    <TextField
                      size={
                        document.body.clientWidth > 767 ? "medium" : "small"
                      }
                      key={unused.index}
                      value={field.barGraphArray[composedIndex]}
                      onChange={(e) =>
                        fieldsDispatch({
                          type: "array",
                          payload: {
                            indexA: field.index - 1,
                            keyA: "barGraphArray",
                            valueA: e.target.value,
                            index2A: composedIndex,
                          },
                        })
                      }
                    />
                  ))
                )}
                {boolCustomColors && !boolComposedValues ? (
                  <MuiColorInput
                    size={document.body.clientWidth > 767 ? "medium" : "small"}
                    label="Bar color"
                    value={field.barGraphCustomColor}
                    onChange={(newValue) =>
                      fieldsDispatch({
                        type: "change",
                        payload: {
                          indexC: field.index - 1,
                          keyC: "barGraphCustomColor",
                          valueC: newValue,
                        },
                      })
                    }
                  />
                ) : null}
                <FaTrash
                  className="myAdd lastItem"
                  onClick={() =>
                    fields.length !== 1 ? deleteField(field.index) : null
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="titleAndPalette">
          <div>
            <p style={{ display: "inline" }}>Add bar</p>
            <CgAddR
              className="myAdd"
              onClick={() => fieldsDispatch({ type: "add" })}
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                className="myCheckbox"
                checked={boolCustomColors}
                onClick={() => {
                  setBoolCustomColors(!boolCustomColors);
                  if (boolCustomColors) {
                    fieldsDispatch({ type: "removeColor" });
                    composedDispatch({ type: "removeColor" });
                  }
                }}
              />
            }
            label="Custom colors"
          />
          <div>
            <FormControlLabel
              style={{ margin: "0" }}
              control={
                <Checkbox
                  className="myCheckbox"
                  checked={boolComposedValues}
                  onClick={() => setBoolComposedValues(!boolComposedValues)}
                />
              }
              label="Grouped bar chart"
            />
            <Tooltip title="A grouped bar graph displays multiple sets of data, with bars grouped for each category. Bars represent values, and color distinguishes datasets.">
              <IconButton className="myInfo">
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </div>
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
          <div className="bgNonTextOptions">
            <div className="optionSection">
              <h4>Canvas options</h4>
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Canvas width"
                value={canvasSizeX}
                onChange={(e) =>
                  !isNaN(Number(e.target.value))
                    ? setCanvasSizeX(Number(e.target.value))
                    : null
                }
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
                onChange={(e) =>
                  !isNaN(Number(e.target.value))
                    ? setCanvasSizeY(Number(e.target.value))
                    : null
                }
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
              <h4>Line options</h4>
              <FormControlLabel
                control={
                  <Checkbox
                    className="myCheckbox"
                    checked={boolShowLines}
                    onChange={() => setBoolShowLines(!boolShowLines)}
                  />
                }
                label="Show horizontal lines"
              />
              <MuiColorInput
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                disabled={!boolShowLines}
                label="Lines color"
                value={line.color}
                onChange={(newValue) => {
                  var a = { ...line };
                  a.color = newValue;
                  setLine(a);
                }}
              />
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                disabled={!boolShowLines}
                label="Lines width"
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
              <Button
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                disabled={!boolShowLines}
                variant="outlined"
                onClick={() => setLine({ color: "grey", size: 1 })}
              >
                Reset to default
              </Button>
            </div>
            <div className="optionSection">
              <h4>Bar options</h4>
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Custom bar width"
                value={customBarWidth}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value)))
                    setCustomBarWidth(Number(e.target.value));
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    className="myCheckbox"
                    checked={boolDisplayValueOnBar}
                    onChange={() =>
                      setBoolDisplayValueOnBar(!boolDisplayValueOnBar)
                    }
                  />
                }
                label="Display value on bar"
              />

              <MuiColorInput
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                disabled={!boolDisplayValueOnBar}
                label="Bar value color"
                value={fieldTextValueOnBar.fieldTextColor}
                onChange={(newValue) => {
                  var a = { ...fieldTextValueOnBar };
                  a.fieldTextColor = newValue;
                  setFieldTextValueOnBar(a);
                }}
              />

              <div className="bgBarFontAndSize">
                <FormControl>
                  <InputLabel>Bar value size</InputLabel>
                  <Select
                    size={document.body.clientWidth > 767 ? "medium" : "small"}
                    disabled={!boolDisplayValueOnBar}
                    label="Bar value size"
                    value={fieldTextValueOnBar.fieldTextSize}
                    onChange={(e) => {
                      var a = { ...fieldTextValueOnBar };
                      a.fieldTextSize = e.target.value;
                      if (!isNaN(Number(e.target.value)))
                        setFieldTextValueOnBar(a);
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
                  <InputLabel>Bar value font</InputLabel>
                  <Select
                    size={document.body.clientWidth > 767 ? "medium" : "small"}
                    disabled={!boolDisplayValueOnBar}
                    label="Bar value font"
                    value={fieldTextValueOnBar.fieldTextFont}
                    onChange={(e) => {
                      var a = { ...fieldTextValueOnBar };
                      a.fieldTextFont = e.target.value;
                      setFieldTextValueOnBar(a);
                    }}
                  >
                    {vectorFontFamily.map((font, index) => (
                      <MenuItem key={index} value={font}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <Button
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                disabled={!boolDisplayValueOnBar}
                variant="outlined"
                onClick={() =>
                  setFieldTextValueOnBar({
                    fieldTextColor: "black",
                    fieldTextSize:
                      document.body.clientWidth > 1300
                        ? 12
                        : document.body.clientWidth > 767
                        ? 10
                        : 8,
                    fieldTextFont: "Arial",
                  })
                }
              >
                Reset to default
              </Button>
            </div>
            <div className="optionSection">
              <h4>
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
                    ? boolComposedValues
                      ? "Please select a value lower than " + globalMinComposed
                      : "Please select a value lower than " + globalMin
                    : null
                }
                label="Lowest value"
                value={unusedMin}
                onChange={(e) => setUnusedMin(e.target.value)}
                onBlur={(e) => handleMin(e)}
              />
              <TextField
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                error={customMax === undefined}
                helperText={
                  customMax === undefined
                    ? boolComposedValues
                      ? "Please select a value higher than" + globalMaxComposed
                      : "Please select a value higher than" + globalMax
                    : null
                }
                value={unusedMax}
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
            <p>Bar names</p>
            <MuiColorInput
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              label="Bar name color"
              value={fieldText.fieldTextColor}
              onChange={(newValue) => {
                var a = { ...fieldText };
                a.fieldTextColor = newValue;
                setFieldText(a);
              }}
            />
            <FormControl>
              <InputLabel>Bar name size</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Bar name size"
                value={fieldText.fieldTextSize}
                onChange={(e) => {
                  var a = { ...fieldText };
                  a.fieldTextSize = e.target.value;
                  if (!isNaN(Number(e.target.value))) setFieldText(a);
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
              <InputLabel>Bar name font</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Bar name font"
                value={fieldText.fieldTextFont}
                onChange={(e) => {
                  var a = { ...fieldText };
                  a.fieldTextFont = e.target.value;
                  setFieldText(a);
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
                setFieldText({
                  fieldTextColor: "black",
                  fieldTextSize:
                    document.body.clientWidth > 1300
                      ? 12
                      : document.body.clientWidth > 767
                      ? 10
                      : 8,
                  fieldTextFont: "Arial",
                })
              }
            >
              Reset to default
            </Button>
            <p>Group names</p>
            <MuiColorInput
              disabled={!boolComposedValues}
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              label="Group color"
              value={fieldTextComposed.fieldTextColor}
              onChange={(newValue) => {
                var a = { ...fieldTextComposed };
                a.fieldTextColor = newValue;
                setFieldTextComposed(a);
              }}
            />
            <FormControl>
              <InputLabel>Group size</InputLabel>
              <Select
                disabled={!boolComposedValues}
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Group size"
                value={fieldTextComposed.fieldTextSize}
                onChange={(e) => {
                  var a = { ...fieldTextComposed };
                  a.fieldTextSize = e.target.value;
                  if (!isNaN(Number(e.target.value))) setFieldTextComposed(a);
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
              <InputLabel>Group font</InputLabel>
              <Select
                disabled={!boolComposedValues}
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Group font"
                value={fieldTextComposed.fieldTextFont}
                onChange={(e) => {
                  var a = { ...fieldTextComposed };
                  a.fieldTextFont = e.target.value;
                  setFieldTextComposed(a);
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
              disabled={!boolComposedValues}
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              variant="outlined"
              onClick={() =>
                setFieldTextComposed({
                  fieldTextColor: "black",
                  fieldTextSize:
                    document.body.clientWidth > 1300
                      ? 12
                      : document.body.clientWidth > 767
                      ? 10
                      : 8,
                  fieldTextFont: "Arial",
                })
              }
            >
              Reset to default
            </Button>
            <p>Scales</p>
            <MuiColorInput
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              label="Bar value color"
              value={fieldTextValue.fieldTextColor}
              onChange={(newValue) => {
                var a = { ...fieldTextValue };
                a.fieldTextColor = newValue;
                setFieldTextValue(a);
              }}
            />
            <FormControl>
              <InputLabel>Scale size</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Scale size"
                value={fieldTextValue.fieldTextSize}
                onChange={(e) => {
                  var a = { ...fieldTextValue };
                  a.fieldTextSize = e.target.value;
                  if (!isNaN(Number(e.target.value))) setFieldTextValue(a);
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
              <InputLabel>Scale font</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Scale font"
                value={fieldTextValue.fieldTextFont}
                onChange={(e) => {
                  var a = { ...fieldTextValue };
                  a.fieldTextFont = e.target.value;
                  setFieldTextValue(a);
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
                setFieldTextValue({
                  fieldTextColor: "black",
                  fieldTextSize:
                    document.body.clientWidth > 1300
                      ? 12
                      : document.body.clientWidth > 767
                      ? 10
                      : 8,
                  fieldTextFont: "Arial",
                })
              }
            >
              Reset to default
            </Button>
            <p>Title</p>
            <MuiColorInput
              size={document.body.clientWidth > 767 ? "medium" : "small"}
              label="Title color"
              value={fieldTextTitle.fieldTextColor}
              onChange={(newValue) => {
                var a = { ...fieldTextTitle };
                a.fieldTextColor = newValue;
                setFieldTextTitle(a);
              }}
            />
            <FormControl>
              <InputLabel>Title size</InputLabel>
              <Select
                size={document.body.clientWidth > 767 ? "medium" : "small"}
                label="Title size"
                value={fieldTextTitle.fieldTextSize}
                onChange={(e) => {
                  var a = { ...fieldTextTitle };
                  a.fieldTextSize = e.target.value;
                  if (!isNaN(Number(e.target.value))) setFieldTextTitle(a);
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
                value={fieldTextTitle.fieldTextFont}
                onChange={(e) => {
                  var a = { ...fieldTextTitle };
                  a.fieldTextFont = e.target.value;
                  setFieldTextTitle(a);
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
                setFieldTextTitle({
                  fieldTextColor: "black",
                  fieldTextSize:
                    document.body.clientWidth > 1300
                      ? 32
                      : document.body.clientWidth > 767
                      ? 24
                      : 18,
                  fieldTextFont: "Arial",
                })
              }
            >
              Reset to default
            </Button>
          </div>
        </Collapse>
      </div>
      <div className="canvasContainer">
        <BarGraphCanvas
          ref={canvasRef}
          fieldsObejct={fields}
          boolShowLines={boolShowLines}
          customBarWidth={customBarWidth}
          boolDisplayValueOnBar={boolDisplayValueOnBar}
          composed={composed}
          boolComposedValues={boolComposedValues}
          canvasSizeX={canvasSizeX}
          canvasSizeY={canvasSizeY}
          title={barGraphTitle}
          customMax={customMax}
          customMin={customMin}
          fieldText={fieldText}
          fieldTextComposed={fieldTextComposed}
          fieldTextValue={fieldTextValue}
          fieldTextTitle={fieldTextTitle}
          fieldTextValueOnBar={fieldTextValueOnBar}
          line={line}
          canvasColor={canvasColor}
          boolCustomColors={boolCustomColors}
        />
        <Button
          variant="contained"
          className="myButton downloadButton"
          onClick={() => {
            downloadCanvas();
          }}
        >
          Download the bar Graph now
        </Button>
      </div>
    </ThemeProvider>
  );
}
export default BarGraph;
