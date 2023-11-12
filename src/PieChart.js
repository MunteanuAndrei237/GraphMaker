import "./pieChart.css";
import PieChartCanvas from "./PieChartCanvas.js";

import { useState } from "react";

import { CgAddR } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowDown } from 'react-icons/io';

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
import myTheme from "./myTheme.js";

const fontSizes =[
  8,
  9,
  10,
  11,
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  28,
  32,
];

const vectorFillColors =  [
  "rgb(255, 192, 203)",
  "rgb(255, 182, 193)",
  "rgb(255, 105, 180)",
  "rgb(255, 20, 147)",
  "rgb(219, 112, 147)",
  "rgb(255, 182, 193)",
  "rgb(238, 130, 238)",
  "rgb(186, 85, 211)",
  "rgb(218, 112, 214)",
  "rgb(199, 21, 133)",
  "rgb(255, 0, 255)",
  "rgb(255, 182, 193)",
  "rgb(255, 192, 203)",
  "rgb(255, 228, 225)",
  "rgb(255, 240, 245)",
  "rgb(255, 182, 193)",
];

const fontOptions = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Palatino",
  "Verdana",
  "Garamond",
  "Bookman",
  "Comic Sans MS",
  "Trebuchet MS",
  "Arial Black",
  "Impact",
  "Lucida Console",
  "Courier",
];

function PieChart() {
  const initialFields = [
    {
      index: 1,
      pieName: "Name1",
      pieValue: 51,
      pieColor: vectorFillColors[1],
      pieCustomColor: vectorFillColors[1],
    },
    {
      index: 2,
      pieName: "Name2",
      pieValue: 49,
      pieColor: vectorFillColors[2],
      pieCustomColor: vectorFillColors[2],
    },
    {
      index: 3,
      pieName: "Name3",
      pieValue: 22,
      pieColor: vectorFillColors[3],
      pieCustomColor: vectorFillColors[3],
    },
    {
      index: 4,
      pieName: "Name4",
      pieValue: 87,
      pieColor: vectorFillColors[4],
      pieCustomColor: vectorFillColors[4],
    },
  ];

  const [fields, setFields] = useState(initialFields);

  const [pieChartTitle, setPieChartTitle] = useState(
    ""
  );
  const [canvasSize, setCanvasSize] = useState(500);
  const [canvasColor, setCanvasColor] = useState("white");
  const [pieChartPercent, setPieChartPercent] = useState(70);

  const [boolDisplayPercent, setBoolDisplayPercent] = useState(true);
  const [boolDisplayValue, setBoolDisplayValue] = useState(false);
  const [boolCustomColors, setBoolCustomColors] = useState(true);
  const [boolValueInside, setBoolValueInside] = useState(true);
  const [boolNameInside, setBoolNameInside] = useState(false);
  const [boolCustomSettings, setBoolCustomSettings] = useState(false);

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
        pieColor: vectorFillColors[prevFields.length + 1],
        pieCustomColor: vectorFillColors[prevFields.length + 1],
      },
    ]);
  };

  function handleCustomColors() {
    setBoolCustomColors(!boolCustomColors);
    
    if (boolCustomColors)
    {
      document.documentElement.style.setProperty('--chartFormSize','27');
      setFields((prevFields) => {
        const newFields = [...prevFields];
        newFields.forEach((element) => {
          element.pieColor = vectorFillColors[element.index];
        });
        return newFields;
      });
    }
      else
      {
        document.documentElement.style.setProperty('--chartFormSize','36');
      }
  }

  function deleteField(ind) {
    var deletedColor = fields[ind - 1].pieColor;
    vectorFillColors.splice(vectorFillColors.indexOf(deletedColor), 1);
    vectorFillColors.splice(fields.length, 0, deletedColor);

    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.splice(ind - 1, 1);
      newFields.forEach((element, index) => {
        element.index = index + 1;
      });

      return newFields;
    });
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

  return (
    <ThemeProvider theme={myTheme}>
      <div className="pieChartContainer">
        <div className="chartForm">
          <h2>Chart Details</h2>
        
          <TextField
            className="pieChartTitle"
            label="Chart name"
            placeholder="Type chart name here"
            value={pieChartTitle}
            onChange={(e) => setPieChartTitle(e.target.value)}
          />
          <div className="fieldsContainer">
          <div><h4>Piechart data</h4></div>
          <div className="tableHeader"><h4>Name</h4>    <h4>Value</h4>  { boolCustomColors ? <h4>Color</h4> : null } <h4>Delete</h4> </div>
          {fields.map((field) => (
            <div className="itemAndSpacer">
              <ListItem className="tableItem" key={field.index}>
              <Input 
                className="myInput"
                placeholder={"Slice name"}
                value={field.pieName}
                onChange={(e) =>
                  handleInputChange(field.index - 1, "pieName", e.target.value)
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
                className="myInput"
                  value={field.pieCustomColor}
                  onChange={newValue =>
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
          <div className="customColorsAndCreate">
          <div>Create new field:<CgAddR onClick={() => createNewField()} /></div>
          <FormControlLabel
            control={<Checkbox checked={ boolCustomColors} onClick={() => handleCustomColors()} />}
            label="Use custom colors"
          />
          </div>
          <div onClick={()=> setBoolCustomSettings(!boolCustomSettings)} >Show options <IoIosArrowDown/></div>
          <Collapse in={boolCustomSettings} className="optionsContainer">
            <div className="optionsFlex"><div>
          <h2>Piechart options</h2>
          <div>
          <TextField 
          type="percent"
          value={pieChartPercent}
          onChange={(e) => setPieChartPercent(e.target.value)}
          label="Piechart size(in percent)"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
          </div></div><div>
          <h2>Canvas options</h2>
          <TextField className="canvasOption"
            value={canvasSize}
            onChange={(e) =>
              !isNaN(Number(e.target.value))
                ? setCanvasSize(Number(e.target.value))
                : null
            }
            label="Canvas size(in pixels)"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          <MuiColorInput className="canvasOption"
            label="Canvas color"
            value={canvasColor}
            onChange={(newValue) => setCanvasColor(newValue)}
          />
          </div></div>
        
          <h2>Text options</h2>
          <div className="textOptions">
          <p>Title text </p>
          <MuiColorInput
            label="title color"
            value={titleText.color}
            onChange={newValue => {
              var a = { ...titleText };
              a.color = newValue;
              setTitleText(a);
            }}
          />
          <FormControl>
          <InputLabel >Title size</InputLabel>
            <Select
              value={titleText.size}
              onChange={(e) => {
                var a = { ...titleText };
                a.size = e.target.value;
                if (!isNaN(Number(e.target.value))) setTitleText(a);
              }}
            >
              {fontSizes.map((size, index) => (
                <MenuItem key={index} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
        
        <InputLabel >Title font</InputLabel>
            <Select
              value={titleText.font}
              onChange={(e) => {
                var a = { ...titleText };
                a.font = e.target.value;
                setTitleText(a);
              }}
            >
              {fontOptions.map((font, index) => (
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
            onChange={newValue => {
              var a = { ...namesText };
              a.color = newValue;
              setNamesText(a);
            }}
          />
          <FormControl>
          <InputLabel >Names size</InputLabel>
            <Select
              value={namesText.size}
              onChange={(e) => {
                var a = { ...namesText };
                a.size = e.target.value;
                if (!isNaN(Number(e.target.value))) setNamesText(a);
              }}
            >
              {fontSizes.map((size, index) => (
                <MenuItem key={index} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
          <InputLabel >Names font</InputLabel>
            <Select
              value={namesText.font}
              onChange={(e) => {
                var a = { ...namesText };
                a.font = e.target.value;
                setNamesText(a);
              }}
              size="meidum"
            >
              {fontOptions.map((font, index) => (
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
            onChange={newValue => {
              var a = { ...valuesText };
              a.color =newValue;
              setValuesText(a);
            }}
          />
        
          <FormControl>
          <InputLabel >Values size</InputLabel>
            <Select
              value={valuesText.size}
              onChange={(e) => {
                var a = { ...valuesText };
                a.size = e.target.value;
                if (!isNaN(Number(e.target.value))) setValuesText(a);
              }}
            >
              {fontSizes.map((size, index) => (
                <MenuItem key={index} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
          <InputLabel >Values font</InputLabel>
            <Select
              value={valuesText.font}
              onChange={(e) => {
                var a = { ...valuesText };
                a.font = e.target.value;
                setValuesText(a);
              }}
            >
              {fontOptions.map((font, index) => (
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
          pieChartPercent={pieChartPercent}
        />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default PieChart;
