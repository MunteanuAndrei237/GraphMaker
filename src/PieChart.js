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

function PieChart(){
    const initialFields = [
        { index: 1, pieName: "male", pieValue: 51 ,pieColor:vectorFillColors[1]},
        { index: 2, pieName: "female", pieValue: 49,pieColor:vectorFillColors[2] },
      ];
      
      const [fields, setFields] = useState(initialFields);
      const [boolCustomColors,setBoolCustomColors]=useState(false);
      const [pieChartTitle,setPieChartTitle]=useState("Population distribution by gender");
      const [canvasSize,setCanvasSize]=useState(500);
      const [boolDisplayPercent,setBoolDisplayPercent]=useState(true);
      const [boolDisplayValue,setBoolDisplayValue]=useState(false);

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
          { index: prevFields.length + 1, pieName: "", pieValue: 0 ,pieColor:vectorFillColors[prevFields.length + 1]},
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
            maxLength="35"
            ></input>
          {fields.map((field) => (
            <div key={field.index}> Field {field.index}
              <input
                placeholder={"Field name"}
                className="pieName"
                value={field.pieName}
                onChange={(e) => handleInputChange(field.index - 1, 'pieName', e.target.value)}
                maxLength="22"
              />
              <input
                className="pieValue"
                value={field.pieValue}
                onChange={(e) => handleInputChangeNumber(field.index - 1, 'pieValue', e.target.value)}
                maxLength="22"
              />
              {boolCustomColors ? 
              <input 
              type="color" 
              value={field.pieColor || '#000000'} 
              onChange={(e) => handleInputChange(field.index - 1, 'pieColor', e.target.value)}
              /> : null}
              <FaTrash onClick={() => fields.length!==1 ? deleteField(field.index) : null} />
            </div>
          ))}
          Custom colors<input type="checkbox" id="po" onClick={()=>handleCustomColors()}></input>
          Set canvas size<input  value={canvasSize} onChange={e=> !isNaN(Number(e.target.value)) ? setCanvasSize( Number(e.target.value)) : null }></input>
          Display Percent<input type="checkbox" checked={boolDisplayPercent} onClick={()=>handleDisplayPercentOrValue("p")}></input>
          Display Value<input type="checkbox" checked={boolDisplayValue} onClick={()=>handleDisplayPercentOrValue("v")}></input>
          <CgAddR onClick={() => createNewField()} />
          
        </div>
        
        <PieChartCanvas fieldsObejct= {fields} canvasSize={canvasSize} title={pieChartTitle} boolDisplayPercent={boolDisplayPercent} boolDisplayValue={boolDisplayValue} />
        </div>
      );
    }

    export default PieChart;