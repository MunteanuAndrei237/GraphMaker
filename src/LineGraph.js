import { useState } from "react";
import { CgAddR } from 'react-icons/cg';
import LineGraphCanvas from './LineGraphCanvas.js';
import { FaTrash } from 'react-icons/fa';

function LineGraph()
{
    const initialFields = [
        { index: 1, lineGraphXValue: 16, lineGraphYValue: 51 },
        { index: 2, lineGraphXValue: 18, lineGraphYValue: 49 },
      ];

      const [fields, setFields] = useState(initialFields);
      const [boolDisplayXLines,setBoolDisplayXLines]=useState(false);
      const [boolDisplayYLines,setBoolDisplayYLines]=useState(false);
    //   const handleInputChange = (index, key, value) => {
    //     setFields((prevFields) => {
    //       const newFields = [...prevFields];
    //       newFields[index][key] = value;
    //       return newFields;
    //     });
    //   };
    
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
          { index: prevFields.length + 1, lineGraphXValue: 0, lineGraphYValue: 0 },
        ]);
      };

      
      function deleteField(ind){

        setFields((prevFields) => {
          const newFields = [...prevFields];
          newFields.splice(ind-1,1);
          newFields.forEach((element,index) => {
            element.index=index+1;
          });
          
          return newFields;
        });
      }

    return(
        <div className="lineGraphContainer">
            <div className="lineGraphForm" >
            Title:(optional)<input placeholder="Yout title here"></input>
            {fields.map((field) => (
            <div key={field.index}> Field {field.index}
              <input
                className="lineGraphXValue"
                value={field.lineGraphXValue}
                onChange={(e) => handleInputChangeNumber(field.index - 1, 'lineGraphXValue', e.target.value)}

              />
              <input
                className="lineGraphYValue"
                value={field.lineGraphYValue}
                onChange={(e) => handleInputChangeNumber(field.index - 1, 'lineGraphYValue', e.target.value)}
                
              />
              <FaTrash onClick={() => fields.length!==2 ? deleteField(field.index) : null} />
              </div>
              ))}
               Display X lines <input type="checkbox" value={boolDisplayXLines} onChange={()=> setBoolDisplayXLines(!boolDisplayXLines)} />
               Display Y lines <input type="checkbox" value={boolDisplayYLines} onChange={()=> setBoolDisplayYLines(!boolDisplayYLines)} />
            <CgAddR onClick={() => createNewField()} />

            </div>
            <LineGraphCanvas fieldsObejct= {fields} boolDisplayXLines = {boolDisplayXLines}  boolDisplayYLines = {boolDisplayYLines} />
        </div>
    )
}

export default LineGraph;



      
      

    
            
          
             
              
            
          
          
          
       
       
   
   