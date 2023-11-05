import BarGraphCanvas from "./BarGraphCanvas";
import  { useState } from "react";
import { CgAddR } from 'react-icons/cg';
import { FaTrash } from 'react-icons/fa';


var vectorFillColors=['0','#FF0000','#00FF00','#0000FF','#FFFF00','#00FFFF','#FF00FF','#C0C0C0','#808080','#800000','#808000','#008000','#800080','#008080','#000080','#FFFFFF']
var vectorFillColors2=['0','#FF0000','#00FF00','#0000FF','#FFFF00','#00FFFF','#FF00FF','#C0C0C0','#808080','#800000','#808000','#008000','#800080','#008080','#000080','#FFFFFF']


function BarGraph()
{
    const initialFields = [
        { index: 1, barGraphName: "male", barGraphValue: 180,barGraphColor:vectorFillColors[1],barGraphArray:[175,185]},
        { index: 2, barGraphName: "female", barGraphValue: 160 ,barGraphColor:vectorFillColors[2],barGraphArray:[150,170]},
      ];
      const initialComposed=[{index:1,composedName:"european",composedColor:vectorFillColors2[1]},{index:2,composedName:"asian",composedColor:vectorFillColors2[2]}]



      const [fields, setFields] = useState(initialFields);
      const [boolShowLines,setBoolShowLines]=useState(false);
      const [boolDisplayValueOnBar,setBoolDisplayValueOnBar]=useState(false);
      const [boolCustomColors,setBoolCustomColors]=useState(false);
      const [boolComposedValues,setBoolComposedValues]=useState(false);
      const [composed, setComposed] = useState(initialComposed);

      function handleCustomColors(){
        setBoolCustomColors(!boolCustomColors);
        if(boolCustomColors)
        {
          setFields((prevFields) => {
            const newFields = [...prevFields];
            newFields.forEach(element => {
              element.barGraphColor=vectorFillColors[element.index];
            });
            return newFields;
          });
          setComposed((composed) => {
            const newComposed = [...composed];
            newComposed.forEach(element => {
              element.composedColor=vectorFillColors2[element.index];
            });
            return newComposed;
          });
        }
       
      }

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
          { index: prevFields.length + 1, barGraphName: "", barGraphValue: 0 ,barGraphColor:vectorFillColors[prevFields.length + 1],barGraphArray:Array.from({ length: composed.length }, () => 0)},
        ]);
      };
      
      function deleteField(ind)
      {
        var deletedColor=fields[ind-1].barGraphColor;
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

      function handleComposedValues()
      {
        setBoolComposedValues(!boolComposedValues);
      }

      
      
      const createNewComposedField = () => {
        setFields((prevFields) => {
          const newFields = [...prevFields];
          newFields.forEach(element => {
            if (element.barGraphArray.length=== composed.length)
            element.barGraphArray.push(0);
          });
          return newFields;
        });
        setComposed((composed) => {
          const newComposed = [...composed];
          newComposed.push({ index: composed.length + 1, composedName: "", composedColor:vectorFillColors2[composed.length + 1]});
          return newComposed;
      })
      }

      const handleInputChangeComposed = (index,key,value) =>{
        setComposed((composed) => {
          const newComposed = [...composed];
          newComposed[index][key] = value;
          return newComposed;
        });
      }

      function handleInputChangeComposedValue(index, key, value,index2)
      {
        setFields((prevFields) => {
          const newFields = [...prevFields];
          if(!isNaN(Number(value)))
          newFields[index][key][index2] = Number(value);
          
          return newFields;
        });
      }

      function deleteComposedField(ind)
      {
        var deletedColor2=composed[ind].composedColor;
          vectorFillColors2.splice(vectorFillColors2.indexOf(deletedColor2),1);
          vectorFillColors2.splice(composed.length,0,deletedColor2);

        setFields((prevFields) => {//add hooks
          const newFields = prevFields.map((element) => {
            const newBarGraphArray = [...element.barGraphArray];
            newBarGraphArray.splice(ind, 1);
            return { ...element, barGraphArray: newBarGraphArray };
          });
        
          
          return newFields;
        });

          setComposed((composed) => {
            const newComposed = [...composed];
            newComposed.splice(ind,1);
            newComposed.forEach((element,index) => {
              element.index=index+1;
            });
            return newComposed;
          })
          
      }

      return (
        <div className="barGraphContainer">
        <div className="barGraphForm">
            Title:(optional)<input placeholder="Yout title here"></input>

            {
              boolComposedValues ?
              <div>
                Enter your composed values h: 
                {composed.map((field,index) => (
                  <div key={index} display="inline" >
                  <input 
                  className="barGraphComposedValue"
                  value={field.composedName}
                  onChange={(e) => { handleInputChangeComposed(index,'composedName' ,e.target.value )}}
                  maxLength="22"
                  display="inline"
                  />
                  {boolCustomColors && boolComposedValues ?
                  <input 
                  type="color"
                  value={field.composedColor || '#000000'}
                  onChange={(e) => { handleInputChangeComposed(index,'composedColor' ,e.target.value )}}
                  display="inline"
                  /> : null
                  }
                  <FaTrash onClick={() => composed.length!==1 ? deleteComposedField(index) : null } />
                  </div>
                ))}
                 <CgAddR  display="inline" onClick={() => createNewComposedField()} />
              </div>
                : null
            }
          {fields.map((field) => (

   
            
            <div key={field.index}> Field {field.index}
              <input
                placeholder={"Field name"}
                className="barGraphName"
                value={field.barGraphName}
                onChange={(e) => handleInputChange(field.index - 1, 'barGraphName', e.target.value)}
                maxLength="22"
              />
              { !boolComposedValues ?
              <input
                className="barGraphValue"
                value={field.barGraphValue}
                onChange={(e) => handleInputChangeNumber(field.index - 1, 'barGraphValue', e.target.value)}
                maxLength="22"
              /> : 
              composed.map((composedField,composedIndex) => (
                <input
                key={composedIndex}
                display="inline"
                className="barGraphValue"
                value={field.barGraphArray[composedIndex]}
                onChange={(e) => handleInputChangeComposedValue(field.index - 1, 'barGraphArray', e.target.value ,composedIndex)}
                maxLength="22"
              /> 
              ))
              }
               {boolCustomColors && !boolComposedValues ? 
              <input 
              type="color" 
              value={field.barGraphColor || '#000000'} 
              onChange={(e) => handleInputChange(field.index - 1, 'barGraphColor', e.target.value)}
              /> : null}
             
              <FaTrash onClick={() => fields.length!==1 ? deleteField(field.index) : null} />
            </div>
          ))}
          Display lines <input type="checkbox" value={boolShowLines} onChange={()=> setBoolShowLines(!boolShowLines)} />
          Display value on bar <input type="checkbox" value={boolDisplayValueOnBar} onChange={()=> setBoolDisplayValueOnBar(!boolDisplayValueOnBar)} />
          Custom colors<input type="checkbox" id="po" onClick={()=>handleCustomColors()}></input>
          Composed values <input type="checkbox" onClick={()=>handleComposedValues()}></input>
          <CgAddR onClick={() => createNewField()} />
          
        </div>
        <BarGraphCanvas fieldsObejct= {fields} boolShowLines={boolShowLines} boolDisplayValueOnBar={boolDisplayValueOnBar} composed={composed} boolComposedValues={boolComposedValues}/>
        </div>
      );

}
export default BarGraph;