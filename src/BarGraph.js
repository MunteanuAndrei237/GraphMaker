import { useState, useRef, useReducer } from "react";
import { CgAddR } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ThemeProvider } from "@emotion/react";

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
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";

import PinkAndWhiteTheme from "./themes/PinkAndWhiteTheme.js";
import utilitiesData from "./utilities.json";

const vectorColorPalettes = utilitiesData.vectorColorPalettes;
const vectorFontFamily = utilitiesData.vectorFontFamily;
const vectorFontSizes = utilitiesData.vectorFontSizes;

function BarGraph() {
  const canvasRef = useRef();
  const [colorPalette, setColorPalette] = useState(vectorColorPalettes[0]);
  const [theme, setTheme] = useState(PinkAndWhiteTheme);
  var minRef = useRef(null);
  var maxRef = useRef(null);

  var globalMax = 180;
  var globalMin = 160;
  var globalMaxComposed = 185;
  var globalMinComposed = 150;

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
            barGraphValue: 0,
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

  const [canvasSizeX, setCanvasSizeX] = useState(700);
  const [canvasSizeY, setCanvasSizeY] = useState(300);
  const [canvasColor, setCanvasColor] = useState("white");

  const [boolShowLines, setBoolShowLines] = useState(true);
  const [boolDisplayValueOnBar, setBoolDisplayValueOnBar] = useState(false);
  const [boolCustomColors, setBoolCustomColors] = useState(true);
  const [boolComposedValues, setBoolComposedValues] = useState(false);
  const [boolSameColorForName, setBoolSameColorForName] = useState(false);
  const [boolDisplayOptions, setBoolDisplayOptions] = useState(false);

  const [barGraphTitle, setBarGraphTitle] = useState(
    "Average height by country"
  );
  const [customMin, setCustomMin] = useState(null);
  const [customMax, setCustomMax] = useState(null);

  const [fieldText, setFieldText] = useState({
    fieldTextColor: "black",
    fieldTextSize: 12,
    fieldTextFont: "Arial",
  });
  const [fieldTextComposed, setFieldTextComposed] = useState({
    fieldTextColor: "black",
    fieldTextSize: 12,
    fieldTextFont: "Arial",
  });
  const [fieldTextValue, setFieldTextValue] = useState({
    fieldTextColor: "black",
    fieldTextSize: 12,
    fieldTextFont: "Arial",
  });
  const [fieldTextTitle, setFieldTextTitle] = useState({
    fieldTextColor: "black",
    fieldTextSize: 32,
    fieldTextFont: "Arial",
  });
  const [fieldTextValueOnBar, setFieldTextValueOnBar] = useState({
    fieldTextColor: "black",
    fieldTextSize: 12,
    fieldTextFont: "Arial",
  });
  const [line, setLine] = useState({ color: "grey", size: 1 });

  function deleteField(ind) {
    // var deletedColor = fields[ind - 1].barGraphColor;
    // colorPalette.vectorFillColors.splice(colorPalette.vectorFillColors.indexOf(deletedColor), 1);
    // colorPalette.vectorFillColors.splice(fields.length, 0, deletedColor);
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
        alert("Choose a number greater than " + globalMax);
      }
    } else {
      if (
        !isNaN(Number(e.target.value)) &&
        Number(e.target.value) >= globalMaxComposed
      ) {
        setCustomMax(Number(e.target.value));
      } else alert("Choose a number greater than " + globalMaxComposed);
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
      } else alert("Choose a number smaller than " + globalMin);
    } else {
      if (
        !isNaN(Number(e.target.value)) &&
        Number(e.target.value) <= globalMinComposed
      ) {
        setCustomMin(Number(e.target.value));
      } else alert("Choose a number smaller than " + globalMinComposed);
    }
  }

  function changeComposedValuesState() {
    setBoolComposedValues(!boolComposedValues);
    if (boolComposedValues) {
      if (customMax < globalMaxComposed) setCustomMax(globalMaxComposed);
      if (customMin > globalMinComposed) setCustomMin(globalMinComposed);
    } else {
      if (customMax < globalMax) setCustomMax(globalMax);
      if (customMin > globalMin) setCustomMin(globalMin);
    }
  }

  function deleteComposedField(ind) {
    // var deletedColor = composed[ind].composedColor;
    // colorPalette.vectorFillColors.splice(colorPalette.vectorFillColors.indexOf(deletedColor), 1);
    // colorPalette.vectorFillColors.splice(composed.length, 0, deletedColor);
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
              className="titleInput"
              label="Title"
              placeholder="Yout title here"
              value={barGraphTitle}
              onChange={(e) => setBarGraphTitle(e.target.value)}
            />
            <FormControl>
              <InputLabel>Color pallette</InputLabel>
              <Select
                label="colorPalette"
                value={colorPalette.name}
                onChange={(e) => {
                  changeColorPalette(
                    vectorColorPalettes.find(
                      (obj) => obj.name === e.target.value
                    )
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
          <div className="bgFieldsContainerContainer">
            {boolComposedValues ? (
              <div className="composedValuesHeaer">
                <div className="lgTopRightcorner"></div>
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
                      className="xInputTrash"
                      onClick={() =>
                        composed.length !== 1
                          ? deleteComposedField(index)
                          : null
                      }
                    />
                  </div>
                ))}
                <CgAddR
                  display="inline"
                  onClick={() => {
                    fieldsDispatch({ type: "addComposed" });
                    composedDispatch({ type: "addComposed" });
                  }}
                />
              </div>
            ) : (
              <div className="bgFieldHeader">
                <h4>Bar name</h4> <h4>Bar value</h4>
                {boolCustomColors ? <h4> Bar color</h4> : null} <h4>Delete</h4>
                <div></div>
                <div></div>
                <div></div>
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
              Add new field
              <CgAddR onClick={() => fieldsDispatch({ type: "add" })} />
            </div>

            <FormControlLabel
              control={
                <Checkbox
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

            <FormControlLabel
              control={
                <Checkbox
                  checked={boolComposedValues}
                  onClick={() => changeComposedValuesState()}
                />
              }
              label="Grouped bar chart"
            />
          </div>
          <div onClick={() => setBoolDisplayOptions(!boolDisplayOptions)}>
            Show options <IoIosArrowDown />
          </div>

          <Collapse in={boolDisplayOptions} className="optionsContainer">
            <div className="bgNonTextOptions">
              <div className="optionSection">
                <h4>Canvas options</h4>
                <TextField
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
                  label="Canvas color"
                  value={canvasColor}
                  onChange={(newValue) => setCanvasColor(newValue)}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    setCanvasSizeX(700);
                    setCanvasSizeY(300);
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
                      checked={boolShowLines}
                      onChange={() => setBoolShowLines(!boolShowLines)}
                    />
                  }
                  label="Show horizontal lines"
                />
                <MuiColorInput
                  label="Lines color"
                  value={line.color}
                  onChange={(newValue) => {
                    var a = { ...line };
                    a.color = newValue;
                    setLine(a);
                  }}
                />
                <TextField
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
                  variant="outlined"
                  onClick={() => setLine({ color: "grey", size: 1 })}
                >
                  Reset to default
                </Button>
              </div>
              <div className="optionSection">
                <h4>Bar options</h4>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={boolSameColorForName}
                      onChange={() =>
                        setBoolSameColorForName(!boolSameColorForName)
                      }
                    />
                  }
                  label="Use bar color for name"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={boolDisplayValueOnBar}
                      onChange={() =>
                        setBoolDisplayValueOnBar(!boolDisplayValueOnBar)
                      }
                    />
                  }
                  label="Display value on bar"
                />

                <MuiColorInput
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
                  variant="outlined"
                  onClick={() =>
                    setFieldTextValueOnBar({
                      fieldTextColor: "black",
                      fieldTextSize: 12,
                      fieldTextFont: "Arial",
                    })
                  }
                >
                  Reset to default
                </Button>
              </div>
              <div className="optionSection">
                <h4>Custom range</h4>
                <TextField
                  label="Lowest value"
                  ref={minRef}
                  onBlur={(e) => handleMin(e)}
                />
                <TextField
                  label="Highest value"
                  ref={maxRef}
                  onBlur={(e) => handleMax(e)}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    setCustomMax(null);
                    setCustomMin(null);
                    minRef.current.value = "";
                    maxRef.current.value = "";
                  }}
                >
                  Delete custom values
                </Button>
              </div>
            </div>
            <div className="lgTextHeader">
              <h2>Text options</h2>
            </div>
            <div className="textOptions">
              Bar names
              <MuiColorInput
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
                variant="outlined"
                onClick={() =>
                  setFieldText({
                    fieldTextColor: "black",
                    fieldTextSize: 12,
                    fieldTextFont: "Arial",
                  })
                }
              >
                Reset to default
              </Button>
              Group names
              <MuiColorInput
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
                variant="outlined"
                onClick={() =>
                  setFieldTextComposed({
                    fieldTextColor: "black",
                    fieldTextSize: 12,
                    fieldTextFont: "Arial",
                  })
                }
              >
                Reset to default
              </Button>
              Scales
              <MuiColorInput
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
                variant="outlined"
                onClick={() =>
                  setFieldTextValue({
                    fieldTextColor: "black",
                    fieldTextSize: 12,
                    fieldTextFont: "Arial",
                  })
                }
              >
                Reset to default
              </Button>
              Title
              <MuiColorInput
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
                variant="outlined"
                onClick={() =>
                  setFieldTextTitle({
                    fieldTextColor: "black",
                    fieldTextSize: 32,
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
            boolSameColorForName={boolSameColorForName}
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
