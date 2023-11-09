import { useState } from "react";
import { CgAddR } from 'react-icons/cg';
import PieChartCanvas from './PieChartCanvas.js';
import { FaTrash } from 'react-icons/fa';

const vectorFillColors = [
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

function PieChart(){
    const initialFields = [
        { index: 1, pieName: "male", pieValue: 51 ,pieColor:vectorFillColors[1],pieCustomColor:vectorFillColors[1]},
        { index: 2, pieName: "female", pieValue: 49,pieColor:vectorFillColors[2],pieCustomColor:vectorFillColors[2]},
      ];
      
      const [fields, setFields] = useState(initialFields);
      
      const [pieChartTitle,setPieChartTitle]=useState("Population distribution by gender");
      const [canvasSize,setCanvasSize]=useState(500);
      const [canvasColor,setCanvasColor]=useState("#FFFFFF");


      const [boolDisplayPercent,setBoolDisplayPercent]=useState(true);
      const [boolDisplayValue,setBoolDisplayValue]=useState(false);
      const [boolCustomColors,setBoolCustomColors]=useState(false);
      const [boolValueInside,setBoolValueInside]=useState(true);
      const [boolNameInside,setBoolNameInside]=useState(false);

      const [titleText,setTitleText]=useState({color:"#000000",size:30,font:"Arial"});
      const [valuesText,setValuesText]=useState({color:"#000000",size:15,font:"Arial"});
      const [namesText,setNamesText]=useState({color:"#000000",size:15,font:"Arial"});

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
          if(!isNaN(Number(value)))
          newFields[index][key] = Number(value);
          return newFields;
        });
      };
    

      const createNewField = () => {
        setFields((prevFields) => [
          ...prevFields,
          { index: prevFields.length + 1, pieName: "", pieValue: 0 ,pieColor:vectorFillColors[prevFields.length + 1],pieCustomColor:vectorFillColors[prevFields.length + 1] },
        ]);
      };

      

      function handleCustomColors(){
        setBoolCustomColors(!boolCustomColors);
        if(boolCustomColors)
        setFields((prevFields) => {
          const newFields = [...prevFields];
          newFields.forEach(element => {
            element.pieColor=vectorFillColors[element.index];
          });
          return newFields;
        });
      }

      function deleteField(ind){
          var deletedColor=fields[ind-1].pieColor;
          vectorFillColors.splice(vectorFillColors.indexOf(deletedColor),1);
          vectorFillColors.splice(fields.length,0,deletedColor);

        setFields((prevFields) => {
          const newFields = [...prevFields];
          newFields.splice(ind-1,1);
          newFields.forEach((element,index) => {
            element.index=index+1;
          });
          
          return newFields;
        });
      }

      function handleDisplayPercentOrValue(s)
      {
          if(s==="p")
            {
            setBoolDisplayPercent(!boolDisplayPercent);
            setBoolDisplayValue(false);
            }
          if(s==="v")
            {
              setBoolDisplayValue(!boolDisplayValue);
              setBoolDisplayPercent(false);
            }
            
      }

      return (
        <div className="pieChartContainer">
        <div className="chartForm">
            Title:<input 
            placeholder="Yout title here" 
            value={pieChartTitle} 
            onChange={e=> setPieChartTitle(e.target.value)} 

            ></input>
          {fields.map((field) => (
            <div key={field.index}> Field {field.index}
              <input
                placeholder={"Field name"}
                className="pieName"
                value={field.pieName}
                onChange={(e) => handleInputChange(field.index - 1, 'pieName', e.target.value)}

              />
              <input
                className="pieValue"
                value={field.pieValue}
                onChange={(e) => handleInputChangeNumber(field.index - 1, 'pieValue', e.target.value)}

              />
              {boolCustomColors ? 
              <input 
              type="color" 
              value={field.pieCustomColor } 
              onChange={(e) => handleInputChange(field.index - 1, 'pieCustomColor', e.target.value)}
              /> : null}
              <FaTrash onClick={() => fields.length!==1 ? deleteField(field.index) : null} />
            </div>
          ))}
          Custom colors<input type="checkbox" id="po" onClick={()=>handleCustomColors()}></input>
          Set canvas size<input  value={canvasSize}  onChange={e=> !isNaN(Number(e.target.value)) ? setCanvasSize( Number(e.target.value)) : null }></input>
          Canavs color <input type="color" value={canvasColor} onChange={e => setCanvasColor(e.target.value)}/>
          Display Percent<input type="checkbox" checked={boolDisplayPercent} onClick={()=>handleDisplayPercentOrValue("p")}></input>
          Display Value<input type="checkbox" checked={boolDisplayValue} onClick={()=>handleDisplayPercentOrValue("v")}></input>
          <br></br>
          Put value inside <input type="checkbox" checked={boolValueInside} onClick={()=>setBoolValueInside(!boolValueInside)}></input>
          Put name inside <input type="checkbox" checked={boolNameInside} onClick={()=>setBoolNameInside(!boolNameInside)}></input>
          <br></br>
          Customize title  <input type="color" value={titleText.color} onChange={e => {var a={...titleText};a.color= e.target.value; setTitleText(a)}}/>
          <input value={titleText.size} onChange={e => {var a={...titleText};a.size= e.target.value; if(!isNaN(Number(e.target.value)))  setTitleText(a) }}/>
          <select value={titleText.font} onChange={e => {var a={...titleText};a.font= e.target.value; setTitleText(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={ () => setTitleText({font:"Arial",size:30,color:"#000000"})}> Reset to default</button>
          <br></br>
          Customize values  <input type="color" value={valuesText.color} onChange={e => {var a={...valuesText};a.color= e.target.value; setValuesText(a)}}/>
          <input value={valuesText.size} onChange={e => {var a={...valuesText};a.size= e.target.value; if(!isNaN(Number(e.target.value)))  setValuesText(a) }}/>
          <select value={valuesText.font} onChange={e => {var a={...valuesText};a.font= e.target.value; setValuesText(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={ () => setValuesText({font:"Arial",size:15,color:"#000000"})}> Reset to default</button>
          <br></br>
          Customize names  <input type="color" value={namesText.color} onChange={e => {var a={...namesText};a.color= e.target.value; setNamesText(a)}}/>
          <input value={namesText.size} onChange={e => {var a={...namesText};a.size= e.target.value; if(!isNaN(Number(e.target.value)))  setNamesText(a) }}/>
          <select value={namesText.font} onChange={e => {var a={...namesText};a.font= e.target.value; setNamesText(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={ () => setNamesText({font:"Arial",size:15,color:"#000000"})}> Reset to default</button>
          <br></br>
          <CgAddR onClick={() => createNewField()} />
          
        </div>
        
        <PieChartCanvas fieldsObejct= {fields} canvasSize={canvasSize} title={pieChartTitle} boolDisplayPercent={boolDisplayPercent} boolDisplayValue={boolDisplayValue}
        boolCustomColors={boolCustomColors } canvasColor={canvasColor}  titleText={titleText} valuesText={valuesText} namesText= {namesText} boolValueInside={boolValueInside }
        boolNameInside={ boolNameInside} /></div>
      );
    }

    export default PieChart;