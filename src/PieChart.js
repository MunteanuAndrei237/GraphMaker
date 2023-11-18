import { useState, useRef, useReducer } from "react";

import { CgAddR } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ThemeProvider } from "@emotion/react";

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
  Switch,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";

import "./pieChart.css";
import PieChartCanvas from "./PieChartCanvas.js";
import PinkAndWhiteTheme from "./themes/PinkAndWhiteTheme.js";
import utilitiesData from "./utilities.json";

const vectorColorPalettes = utilitiesData.vectorColorPalettes;
const vectorFontSizes = utilitiesData.vectorFontSizes;
const vectorFontFamily = utilitiesData.vectorFontFamily;

function PieChart() {
  const [colorPalette, setColorPalette] = useState(vectorColorPalettes[0]);
  const [theme, setTheme] = useState(PinkAndWhiteTheme);
  const canvasRef = useRef();

  const initialFields = [
    {
      index: 1,
      pieName: "O",
      pieValue: 45,
      pieColor: colorPalette.vectorFillColors[1],
      pieCustomColor: colorPalette.vectorFillColors[1],
    },
    {
      index: 2,
      pieName: "A",
      pieValue: 29,
      pieColor: colorPalette.vectorFillColors[2],
      pieCustomColor: colorPalette.vectorFillColors[2],
    },
    {
      index: 3,
      pieName: "B",
      pieValue: 20,
      pieColor: colorPalette.vectorFillColors[3],
      pieCustomColor: colorPalette.vectorFillColors[3],
    },
    {
      index: 4,
      pieName: "AB",
      pieValue: 6,
      pieColor: colorPalette.vectorFillColors[4],
      pieCustomColor: colorPalette.vectorFillColors[4],
    },
  ];

  const [fields, fieldsDispatch] = useReducer(fieldsReducer, initialFields);
  const [pieChartTitle, setPieChartTitle] = useState(
    "Population distribution by blood type"
  );

  function fieldsReducer(state, action) {
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            index: state.length + 1,
            pieName: "",
            pieValue: 0,
            pieColor: colorPalette.vectorFillColors[state.length + 1],
            pieCustomColor: colorPalette.vectorFillColors[state.length + 1],
          },
        ];
      case "change":
        const { indexC, keyC, valueC } = action.payload;
        const newStateC = [...state];
        newStateC[indexC][keyC] = valueC;
        return newStateC;
      case "number":
        const { indexN, keyN, valueN } = action.payload;
        const newStateN = [...state];
        if (!isNaN(Number(valueN))) newStateN[indexN][keyN] = Number(valueN);
        return newStateN;
      case "delete":
        const { indexD} = action.payload;
        const stateD = [...state];
        stateD.splice(indexD - 1, 1);
        stateD.forEach((element, index) => {
          element.index = index + 1;
        });
        return stateD;
      default:
        return state;
    }
  }

  const [canvasSize, setCanvasSize] = useState(500);
  const [canvasColor, setCanvasColor] = useState("white");
  const [pieChartPercent, setPieChartPercent] = useState(70);

  const [boolDisplayPercent, setBoolDisplayPercent] = useState(true);
  const [boolDisplayValue, setBoolDisplayValue] = useState(false);
  const [boolCustomColors, setBoolCustomColors] = useState(true);
  const [boolValueInside, setBoolValueInside] = useState(true);
  const [boolNameInside, setBoolNameInside] = useState(false);
  const [boolDisplayOptions, setBoolDisplayOptions] = useState(false);
  const [boolLegend, setBoolLegend] = useState(false);

  const [titleText, setTitleText] = useState({
    color: "black",
    size: 28,
    font: "Arial",
  });
  const [valuesText, setValuesText] = useState({
    color: "black",
    size: 14,
    font: "Arial",
  });
  const [namesText, setNamesText] = useState({
    color: "black",
    size: 14,
    font: "Arial",
  });
  const [legendText, setLegendText] = useState({
    color: "black",
    size: 14,
    font: "Arial",
  });

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

  function handleCustomColors() {
    setBoolCustomColors(!boolCustomColors);
    if (boolCustomColors) {
      document.documentElement.style.setProperty("--chartFormSize", "27");
    } 
    else 
    document.documentElement.style.setProperty("--chartFormSize", "36");
  }

  function deleteField(ind) {
    var deletedColor = fields[ind - 1].pieColor;
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

  function changeColorPalette(newTheme) {
    loadTheme(newTheme.themeString);
    setColorPalette(newTheme);
    fields.forEach((field) => {
      fieldsDispatch({
        type: "change",
        payload: {
          indexC: field.index-1,
          keyC: "pieCustomColor",
          valueC: newTheme.vectorFillColors[field.index],
        },
      });
      fieldsDispatch({
        type: "change",
        payload: {
          indexC: field.index-1,
          keyC: "pieColor",
          valueC: newTheme.vectorFillColors[field.index],
        },
      });
    });
    for (const key in newTheme.css)
      document.documentElement.style.setProperty("--" + key, newTheme.css[key]);
  }

  function handleDisplayPercentOrValue(s) {
    if (s === "p") {
      setBoolDisplayPercent(!boolDisplayPercent);
      setBoolDisplayValue(false);
    }
    if (s === "v") {
      setBoolDisplayValue(!boolDisplayValue);
      setBoolDisplayPercent(false);
    }
  }

  const downloadCanvas = () => {
    const dataURL = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "canvas_image.png";
    a.click();
  };

  return (
    <ThemeProvider theme={theme}>
        <div className="pieChartForm">
          <h2>Chart Details</h2>
            <div className="titleAndPalette">
              <TextField
                className="titleInput"
                label="Chart name"
                placeholder="Type chart name here"
                value={pieChartTitle}
                onChange={(e) => setPieChartTitle(e.target.value)}
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
          <div className="fieldsContainer">
            <div className="tableHeader">
              <h4>Name</h4> <h4>Value</h4>
              {boolCustomColors ? <h4>Color</h4> : null} <h4>Delete</h4>
            </div>
            {fields.map((field) => (
              <div key={field.index}>
                <ListItem className="tableItem">
                  <Input
                    className="myInput"
                    placeholder="Slice name"
                    value={field.pieName}
                    onChange={(e) =>
                      fieldsDispatch({
                        type: "change",
                        payload: {
                          indexC: field.index - 1,
                          keyC: "pieName",
                          valueC: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    className="myInput"
                    placeholder="Slice value"
                    value={field.pieValue}
                    onChange={(e) =>
                      fieldsDispatch({
                        type: "number",
                        payload: {
                          indexN: field.index - 1,
                          keyN: "pieValue",
                          valueN: e.target.value,
                        },
                      })
                    }
                  />
                  {boolCustomColors ? (
                    <MuiColorInput
                      label="Slice color"
                      className="myInput"
                      value={field.pieCustomColor}
                      onChange={(newValue) =>
                        fieldsDispatch({
                          type: "change",
                          payload: {
                            indexC: field.index - 1,
                            keyC: "pieCustomColor",
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
                </ListItem>
              </div>
            ))}
          </div>
            <div className="titleAndPalette">
              <div>
                Create new field:
                <CgAddR onClick={() => fieldsDispatch({ type: "add" })} />
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={boolCustomColors}
                    onClick={() => handleCustomColors()}
                  />
                }
                label="Use custom colors"
              />
            </div>
          <div onClick={() => setBoolDisplayOptions(!boolDisplayOptions)}>
            Show options <IoIosArrowDown />
          </div>
          <Collapse in={boolDisplayOptions} className="optionsContainer">
            <div className="optionsFlex">
              <div>
                <div className="optionSection">
                  <h4>Piechart options</h4>
                  
                    <TextField
                      type="percent"
                      value={pieChartPercent}
                      onChange={(e) => setPieChartPercent(e.target.value)}
                      label="Piechart size"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />

                    <FormControlLabel
                      className="checkBoxControlLabel"
                      control={
                        <Checkbox
                          checked={boolDisplayPercent}
                          onClick={() => handleDisplayPercentOrValue("p")}
                        />
                      }
                      label="Show percent"
                    />

                    <FormControlLabel
                      className="checkBoxControlLabel"
                      control={
                        <Checkbox
                          checked={boolDisplayValue}
                          onClick={() => handleDisplayPercentOrValue("v")}
                        />
                      }
                      label="Show value"
                    />

                    <FormControlLabel
                      className="checkBoxControlLabel"
                      control={
                        <Switch
                          checked={boolValueInside}
                          onClick={() => setBoolValueInside(!boolValueInside)}
                        />
                      }
                      label="Move values inside"
                    />

                    <FormControlLabel
                      className="checkBoxControlLabel"
                      control={
                        <Switch
                          checked={boolNameInside}
                          onClick={() => setBoolNameInside(!boolNameInside)}
                        />
                      }
                      label="Move names inside"
                    />
                    <FormControlLabel
                      className="checkBoxControlLabel"
                      control={
                        <Checkbox
                          checked={boolLegend}
                          onClick={() => setBoolLegend(!boolLegend)}
                        />
                      }
                      label="Use legend"
                    />
                  
                </div>
              </div>
              <div>
                <div className="optionSection">
                  <h4>Canvas options</h4>
                  <TextField
                    value={canvasSize}
                    onChange={(e) =>
                      !isNaN(Number(e.target.value))
                        ? setCanvasSize(Number(e.target.value))
                        : null
                    }
                    label="Canvas size"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">px</InputAdornment>
                      ),
                    }}
                  />
                  <MuiColorInput
                    label="Canvas color"
                    value={canvasColor}
                    onChange={(newValue) => {
                      setCanvasColor(newValue);
                      document.documentElement.style.setProperty(
                        "--pieChartCanvasContainerColor",
                        newValue
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="lgTextHeader">
              <h2>Text options</h2>
            </div>
            <div className="textOptions">
              <p>Title </p>
              <MuiColorInput
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
                variant="outlined"
                onClick={() =>
                  setTitleText({ font: "Arial", size: 28, color: "black" })
                }
              >
                Reset to default
              </Button>
              <p>Slice names</p>
              <MuiColorInput
                label="Name color"
                value={namesText.color}
                onChange={(newValue) => {
                  var a = { ...namesText };
                  a.color = newValue;
                  setNamesText(a);
                }}
              />
              <FormControl>
                <InputLabel>Name size</InputLabel>
                <Select
                  label="Name size"
                  value={namesText.size}
                  onChange={(e) => {
                    var a = { ...namesText };
                    a.size = e.target.value;
                    if (!isNaN(Number(e.target.value))) setNamesText(a);
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
                <InputLabel>Name font</InputLabel>
                <Select
                  label="Name font"
                  value={namesText.font}
                  onChange={(e) => {
                    var a = { ...namesText };
                    a.font = e.target.value;
                    setNamesText(a);
                  }}
                  size="meidum"
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
                  setNamesText({ font: "Arial", size: 14, color: "black" })
                }
              >
                Reset to default
              </Button>
              <p>Slice values</p>
              <MuiColorInput
                label="Value color"
                value={valuesText.color}
                onChange={(newValue) => {
                  var a = { ...valuesText };
                  a.color = newValue;
                  setValuesText(a);
                }}
              />

              <FormControl>
                <InputLabel>Value size</InputLabel>
                <Select
                  label="Value size"
                  value={valuesText.size}
                  onChange={(e) => {
                    var a = { ...valuesText };
                    a.size = e.target.value;
                    if (!isNaN(Number(e.target.value))) setValuesText(a);
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
                <InputLabel>Value font</InputLabel>
                <Select
                  label="Value font"
                  value={valuesText.font}
                  onChange={(e) => {
                    var a = { ...valuesText };
                    a.font = e.target.value;
                    setValuesText(a);
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
                  setValuesText({ font: "Arial", size: 14, color: "black" })
                }
              >
                Reset to default
              </Button>
              {boolLegend ? <p>Legend</p> : null}
              {boolLegend ? (
                <MuiColorInput
                  label="Legend color"
                  value={legendText.color}
                  onChange={(newValue) => {
                    var a = { ...legendText };
                    a.color = newValue;
                    setLegendText(a);
                  }}
                />
              ) : null}
              {boolLegend ? (
                <FormControl>
                  <InputLabel>Legend size</InputLabel>
                  <Select
                    label="Legend size"
                    value={legendText.size}
                    onChange={(e) => {
                      var a = { ...legendText };
                      a.size = e.target.value;
                      setLegendText(a);
                    }}
                  >
                    {vectorFontSizes.map((size, index) => (
                      <MenuItem key={index} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
              {boolLegend ? (
                <FormControl>
                  <InputLabel>Legend font</InputLabel>
                  <Select
                    label="Legend font"
                    value={legendText.font}
                    onChange={(e) => {
                      var a = { ...legendText };
                      a.font = e.target.value;
                      setLegendText(a);
                    }}
                  >
                    {vectorFontFamily.map((font, index) => (
                      <MenuItem key={index} value={font}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
              {boolLegend ? (
                <Button
                  variant="outlined"
                  onClick={() =>
                    setLegendText({ font: "Arial", size: 14, color: "black" })
                  }
                >
                  Reset to default
                </Button>
              ) : null}
            </div>
          </Collapse>
        </div>
        <div className="canvasContainer">
          <PieChartCanvas
            ref={canvasRef}
            fieldsObejct={fields}
            canvasSize={canvasSize}
            title={pieChartTitle}
            boolDisplayPercent={boolDisplayPercent}
            boolDisplayValue={boolDisplayValue}
            boolCustomColors={boolCustomColors}
            canvasColor={canvasColor}
            titleText={titleText}
            legendText={legendText}
            valuesText={valuesText}
            namesText={namesText}
            boolValueInside={boolValueInside}
            boolNameInside={boolNameInside}
            boolLegend={boolLegend}
            pieChartPercent={pieChartPercent}
          />
          <Button
            variant="contained"
            className="downloadButton"
            onClick={() => {
              downloadCanvas();
            }}
          >
            Download the Piechart now
          </Button>
        </div>
    </ThemeProvider>
  );
}

export default PieChart;
