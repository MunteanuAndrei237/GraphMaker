import { useState, useRef } from "react";

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
      pieName: "Name1",
      pieValue: 51,
      pieColor: colorPalette.vectorFillColors[1],
      pieCustomColor: colorPalette.vectorFillColors[1],
    },
    {
      index: 2,
      pieName: "Name2",
      pieValue: 49,
      pieColor: colorPalette.vectorFillColors[2],
      pieCustomColor: colorPalette.vectorFillColors[2],
    },
    {
      index: 3,
      pieName: "Name3",
      pieValue: 22,
      pieColor: colorPalette.vectorFillColors[3],
      pieCustomColor: colorPalette.vectorFillColors[3],
    },
    {
      index: 4,
      pieName: "Name4",
      pieValue: 87,
      pieColor: colorPalette.vectorFillColors[4],
      pieCustomColor: colorPalette.vectorFillColors[4],
    },
  ];

  const [fields, setFields] = useState(initialFields);
  const [pieChartTitle, setPieChartTitle] = useState("");
  

  const [canvasSize, setCanvasSize] = useState(500);
  const [canvasColor, setCanvasColor] = useState("white");
  const [pieChartPercent, setPieChartPercent] = useState(70);

  const [boolDisplayPercent, setBoolDisplayPercent] = useState(true);
  const [boolDisplayValue, setBoolDisplayValue] = useState(false);
  const [boolCustomColors, setBoolCustomColors] = useState(true);
  const [boolValueInside, setBoolValueInside] = useState(true);
  const [boolNameInside, setBoolNameInside] = useState(false);
  const [boolCustomSettings, setBoolCustomSettings] = useState(false);
  const [boolLegend, setBoolLegend] = useState(false);

  const [titleText, setTitleText] = useState({
    color: "black",
    size: 28,
    font: "Arial"
  });
  const [valuesText, setValuesText] = useState({
    color: "black",
    size: 14,
    font: "Arial"
  });
  const [namesText, setNamesText] = useState({
    color: "black",
    size: 14,
    font: "Arial"
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

  const handleInputChange = (index, key, value) => {
    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index][key] = value;
      return newFields;
    });
  };

  const handleInputChangeNumber = (index, key, value) => {
    setFields((prevFields) => {
      const newFields = [...prevFields];
      if (!isNaN(Number(value))) newFields[index][key] = Number(value);
      return newFields;
    });
  };

  const createNewField = () => {
    setFields((prevFields) => [
      ...prevFields,
      {
        index: prevFields.length + 1,
        pieName: "",
        pieValue: 0,
        pieColor: colorPalette.vectorFillColors[prevFields.length + 1],
        pieCustomColor: colorPalette.vectorFillColors[prevFields.length + 1],
      },
    ]);
  };

  function handleCustomColors() {
    setBoolCustomColors(!boolCustomColors);
    if (boolCustomColors) {
      document.documentElement.style.setProperty("--chartFormSize", "27");
      setFields((prevFields) => {
        const newFields = [...prevFields];
        newFields.forEach((element) => {
          element.pieColor = colorPalette.vectorFillColors[element.index];
        });
        return newFields;
      });
    } else 
      document.documentElement.style.setProperty("--chartFormSize", "36");
  }

  function deleteField(ind) {
    var deletedColor = fields[ind - 1].pieColor;
    setColorPalette((prevColorPalette) => {
      const newColorPalette = { ...prevColorPalette };
      newColorPalette.vectorFillColors.splice(
        newColorPalette.vectorFillColors.indexOf(deletedColor),1);
      newColorPalette.vectorFillColors.splice(fields.length, 0, deletedColor);
      return newColorPalette;
    });

    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.splice(ind - 1, 1);
      newFields.forEach((element, index) => {
        element.index = index + 1;
      });

      return newFields;
    });
  }

  function changeTheme(newTheme) {
    loadTheme(newTheme.themeString);
    setColorPalette(newTheme);
    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.forEach((field) => {
        field.pieColor = newTheme.vectorFillColors[field.index];
        field.pieCustomColor = newTheme.vectorFillColors[field.index];
      });
      return newFields;
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
      <div className="pieChartContainer">
        <div className="chartForm">
          <h2>Chart Details</h2>
          <div className="customColorsAndCreateContainer">
            <div className="tileAndPalette">
              <TextField
                className="pieChartTitle"
                label="Chart name"
                placeholder="Type chart name here"
                value={pieChartTitle}
                onChange={(e) => setPieChartTitle(e.target.value)}
              />
              <FormControl>
                <InputLabel>Color pallette</InputLabel>
                <Select
                  label="colorPalette"
                  value={colorPalette}
                  onChange={(e) => {
                    changeTheme(e.target.value);
                  }}
                >
                  {vectorColorPalettes.map((cp) => (
                    <MenuItem key={cp.index} value={cp}>
                      {cp.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="fieldsContainer">
            <div>
              <h4>Piechart data</h4>
            </div>
            <div className="tableHeader">
              <h4>Name</h4> <h4>Value</h4>{" "}
              {boolCustomColors ? <h4>Color</h4> : null} <h4>Delete</h4>{" "}
            </div>
            {fields.map((field) => (
              <div className="itemAndSpacer" key={field.index}>
                <ListItem className="tableItem">
                  <Input
                    className="myInput"
                    placeholder={"Slice name"}
                    value={field.pieName}
                    onChange={(e) =>
                      handleInputChange(
                        field.index - 1,
                        "pieName",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    className="myInput"
                    placeholder={"Slice value"}
                    value={field.pieValue}
                    onChange={(e) =>
                      handleInputChangeNumber(
                        field.index - 1,
                        "pieValue",
                        e.target.value
                      )
                    }
                  />
                  {boolCustomColors ? (
                    <MuiColorInput
                      label="slice color"
                      className="myInput"
                      value={field.pieCustomColor}
                      onChange={(newValue) =>
                        handleInputChange(
                          field.index - 1,
                          "pieCustomColor",
                          newValue
                        )
                      }
                    />
                  ) : null}
                  <FaTrash
                    onClick={() =>
                      fields.length !== 1 ? deleteField(field.index) : null
                    }
                  />
                </ListItem>
                <div className="spacer"></div>
              </div>
            ))}
          </div>
          <div className="customColorsAndCreateContainer">
            <div className="customColorsAndCreate">
              <div>
                Create new field:
                <CgAddR onClick={() => createNewField()} />
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
          </div>
          <div onClick={() => setBoolCustomSettings(!boolCustomSettings)}>
            Show options <IoIosArrowDown />
          </div>
          <Collapse in={boolCustomSettings} className="optionsContainer">
            <div className="optionsFlex">
              <div>
                <h2>Piechart options</h2>
                <div>
                  <TextField
                    type="percent"
                    value={pieChartPercent}
                    onChange={(e) => setPieChartPercent(e.target.value)}
                    label="Piechart size(in percent)"
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
                    label="Display slice percent"
                  />

                  <FormControlLabel
                    className="checkBoxControlLabel"
                    control={
                      <Checkbox
                        checked={boolDisplayValue}
                        onClick={() => handleDisplayPercentOrValue("v")}
                      />
                    }
                    label="Display slice value"
                  />

                  <FormControlLabel
                    className="checkBoxControlLabel"
                    control={
                      <Checkbox
                        checked={boolValueInside}
                        onClick={() => setBoolValueInside(!boolValueInside)}
                      />
                    }
                    label="Move value inside the piechart"
                  />

                  <FormControlLabel
                    className="checkBoxControlLabel"
                    control={
                      <Checkbox
                        checked={boolNameInside}
                        onClick={() => setBoolNameInside(!boolNameInside)}
                      />
                    }
                    label="Move value inside the piechart"
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
                <h2>Canvas options</h2>
                <TextField
                  className="canvasOption"
                  value={canvasSize}
                  onChange={(e) =>
                    !isNaN(Number(e.target.value))
                      ? setCanvasSize(Number(e.target.value))
                      : null
                  }
                  label="Canvas size(in pixels)"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">px</InputAdornment>
                    ),
                  }}
                />
                <MuiColorInput
                  className="canvasOption"
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

            <h2>Text options</h2>
            <div className="textOptions">
              <p>Title text </p>
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
              <p>Names text</p>
              <MuiColorInput
                label="names color"
                value={namesText.color}
                onChange={(newValue) => {
                  var a = { ...namesText };
                  a.color = newValue;
                  setNamesText(a);
                }}
              />
              <FormControl>
                <InputLabel>Names size</InputLabel>
                <Select
                  label="Names size"
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
                <InputLabel>Names font</InputLabel>
                <Select
                  label="Names font"
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
                className="myButton"
                variant="outlined"
                onClick={() =>
                  setNamesText({ font: "Arial", size: 14, color: "black" })
                }
              >
                Reset to default
              </Button>
              <p>Values text</p>
              <MuiColorInput
                label="values color"
                value={valuesText.color}
                onChange={(newValue) => {
                  var a = { ...valuesText };
                  a.color = newValue;
                  setValuesText(a);
                }}
              />

              <FormControl>
                <InputLabel>Values size</InputLabel>
                <Select
                  label="Values size"
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
                <InputLabel>Values font</InputLabel>
                <Select
                  label="Values font"
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
                className="myButton"
                variant="outlined"
                onClick={() =>
                  setValuesText({ font: "Arial", size: 14, color: "black" })
                }
              >
                Reset to default
              </Button>
            </div>
          </Collapse>
        </div>
        <div className="pieChartCanvasContainer">
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
            valuesText={valuesText}
            namesText={namesText}
            boolValueInside={boolValueInside}
            boolNameInside={boolNameInside}
            boolLegend={boolLegend}
            pieChartPercent={pieChartPercent}
          />
          <Button
            variant="contained"
            className="myButton downloadButton"
            onClick={() => {
              downloadCanvas();
            }}
          >
            Download the Piechart now
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default PieChart;
