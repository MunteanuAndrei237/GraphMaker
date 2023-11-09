import { useState,useRef } from "react";
import { CgAddR } from 'react-icons/cg';
import LineGraphCanvas from './LineGraphCanvas.js';
import { FaTrash } from 'react-icons/fa';


var vectorFillColors=['0','#FF0000','#00FF00','#0000FF','#FFFF00','#00FFFF','#FF00FF','#C0C0C0','#808080','#800000','#808000','#008000','#800080','#008080','#000080','#FFFFFF']
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


function LineGraph()
{
  
    const [xValues, setXValues] = useState([2019,2020,2021]);
    
    var minRef = useRef(null);
    var maxRef = useRef(null);

    var globalMin=21;
    var globalMax=56;

    const initialFields = [
        { index: 1, lineGraphName:"Big mac" , lineGraphColor: "#ff0000", lineGraphYValues: [51,43,21] ,lineGraphCustomColor:"#ff0000"},
        { index: 2, lineGraphName:"Lipton" , lineGraphColor: "#00ff00", lineGraphYValues: [49,32,56] ,  lineGraphCustomColor:"#00ff00"}
      ];

      const [fields, setFields] = useState(initialFields);
      const [boolDisplayXLines,setBoolDisplayXLines]=useState(true);
      const [boolDisplayYLines,setBoolDisplayYLines]=useState(false);
      const [boolCustomColors,setBoolCustomColors]=useState(false);
      const [lineGraphTitle,setLineGraphTitle ] =useState("Price growth of a product")

      const [canvasSizeX,setCanvasSizeX]=useState(600);
      const [canvasSizeY,setCanvasSizeY]=useState(300);
      const [canvasColor,setCanvasColor]=useState("#FFFFFF");
      const [xName, setXName] = useState("Year");
      const [yName, setYName] = useState("Price");
      const [boolDisplayNames,setBoolDisplayNames]=useState(false);
      const [boolDisplayLines ,setBoolDisplayLines]=useState(false);

      const [xValuesText,setXValuesText]=useState({font:"Arial",size:15,color:"#000000"});
      const [yValuesText,setYValuesText]=useState({font:"Arial",size:15,color:"#000000"});
      const [scalesText,setScalesText]=useState({font:"Arial",size:15,color:"#000000"});
      const [titleText,setTitleText]=useState({font:"Arial",size:30,color:"#000000"});
      const [line,setLine]=useState({pointSize:3,size: 1});
      const [grid,setGrid]=useState({size: 1,color:"#000000"});
      const [customMin,setCustomMin]=useState(null);
      const [customMax,setCustomMax]=useState(null);

      function handleMax(e)
      {
        if(e.target.value==="")
          {
            setCustomMax(null);
            return;
          }
          if(!isNaN(Number(e.target.value)) && Number(e.target.value)>=globalMax)
          {
            setCustomMax(Number(e.target.value));
          }
          else
              alert("Choose a number greater than " +  globalMax );
      }

      function handleMin(e)
      {
          if(e.target.value==="")
          {
            setCustomMin(null);
            return;
          }
          if(!isNaN(Number(e.target.value)) && Number(e.target.value)<=globalMin)
          {
            setCustomMin(Number(e.target.value));
          }
          else
              alert("Choose a number smaller than " +  globalMin);
      }

      const handleInputChange = (index, key, value) => {
        setFields((prevFields) => {
          const newFields = [...prevFields];
          newFields[index][key] = value;
          return newFields;
        });
      };
    
      const handleInputChangeNumber = (index, key, value,index2) => {
        setFields((prevFields) => {
          const newFields = [...prevFields];
          if(!isNaN(Number(value)))
          {
            newFields[index][key][index2] = Number(value);
            globalMin=Math.min(globalMin,Number(value));
            globalMax=Math.max(globalMax,Number(value));
          }
          return newFields;
        });
      };
    
    
      const createNewField = () => {
        setFields((prevFields) => [
          ...prevFields,
          { index: prevFields.length + 1,lineGraphName:"" , lineGraphColor: vectorFillColors[prevFields.length + 1], lineGraphYValues:  new Array(xValues.length).fill(0) ,lineGraphCustomColor:vectorFillColors[prevFields.length + 1]}
        ]);
      };

      function createXValue(){
        
        setXValues((prevXValues) => [
          ...prevXValues,0
        ]);
        setFields((prevFields) => {
          const newFields = [...prevFields];
          newFields.forEach(element => {
            while(element.lineGraphYValues.length<=xValues.length)
            element.lineGraphYValues.push(0);
          });
          return newFields;
        });
       
      }
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

      function deleteXValue(ind)
      {
        setXValues((prevXValues) => {
          const newXValues = [...prevXValues];
          newXValues.splice(ind,1);
          return newXValues;
        });
        setFields((prevFields) => {
          const newFields = [...prevFields];
          newFields.forEach(element => {
            element.lineGraphYValues.splice(ind,1);
          });
          return newFields;
        });
       
      }

    return(
        <div className="lineGraphContainer">
            <div className="lineGraphForm" >
            Title:(optional)<input value={lineGraphTitle} onChange={e => setLineGraphTitle(e.target.value) }></input>
            {fields.map((field) => (
              <div>
              <input
                className="lineGraphYValue"
                value={field.lineGraphName}
                onChange={(e) => handleInputChange(field.index - 1, 'lineGraphName', e.target.value)}      
              />
              {boolCustomColors ? <input
                type="color"
                value={field.lineGraphCustomColor}
                onChange={(e) => handleInputChange(field.index - 1, 'lineGraphCustomColor', e.target.value)}
                /> : null
              }
               <FaTrash onClick={() => fields.length!==1 ? deleteField(field.index) : null} />
                </div>
            ))}
            <CgAddR onClick={() => createNewField()} />
            {xValues.map((xValue,index) => (
            <div key={index}> Field {xValue.index}
              <input
                className="lineGraphXValue"
                value={xValue}
                onChange={(e) => {var a = [...xValues];a[index]=Number(e.target.value); setXValues(a)}}
              />
              
              {fields.map((field,index2) => (
              <input
                className="lineGraphYValue"
                value={field.lineGraphYValues[index]}
                onChange={(e) => handleInputChangeNumber(field.index - 1, 'lineGraphYValues', e.target.value,index)}      
              />
              ))}
              <FaTrash onClick={() => xValues.length!==2 ? deleteXValue(index) : null} />
              </div>
              ))}
               
            <CgAddR onClick={() => createXValue()} />
            Display X lines <input type="checkbox"  checked={boolDisplayXLines} onChange={()=> setBoolDisplayXLines(!boolDisplayXLines)} />
            Display Y lines <input type="checkbox"  checked={boolDisplayYLines} onChange={()=> setBoolDisplayYLines(!boolDisplayYLines)} />
            Customize grid <input type="color" value={grid.color} onChange={e => {var a={...grid};a.color= e.target.value; setGrid(a)}}/>
            <input value={grid.size} onChange={e => {var a={...grid};a.size= e.target.value; if(!isNaN(Number(e.target.value)))  setGrid(a) }}/>
            <button onClick={ () => setGrid({size: 1,color:"#000000"})}> Reset to default</button>
            <br></br>
            Custom colors<input type="checkbox" onClick={()=>{setBoolCustomColors(!boolCustomColors);}}></input>
            <br></br>
            Custom x <input value={canvasSizeX} onChange={(e)=>{setCanvasSizeX(e.target.value)}}></input>
            Custom y <input value={canvasSizeY} onChange={(e)=>{setCanvasSizeY(e.target.value)}}></input>
            Canavs color <input type="color" value={canvasColor} onChange={e => setCanvasColor(e.target.value)}/>
            <button onClick={ () => {setCanvasSizeX(600);setCanvasSizeY(300); }}> Resize to normal</button>
            <br></br>
            Name x <input value={xName} onChange={(e)=>{setXName(e.target.value)}}></input>
            Name y <input value={yName} onChange={(e)=>{setYName(e.target.value)}}></input>
            Display names:<input type="checkbox" checked={boolDisplayNames} onChange={()=> setBoolDisplayNames(!boolDisplayNames)} />
            Display lines:<input type="checkbox" checked={boolDisplayLines} onChange={()=> setBoolDisplayLines(!boolDisplayLines)} />
            <br></br>
            Custom min <input  ref={ minRef} onBlur ={e=> handleMin(e) } ></input>
          Custom max <input ref={ maxRef}  onBlur ={e=> handleMax(e) } ></input>
          <button onClick={ () => {setCustomMax(null);setCustomMin(null);minRef.current.value=null;maxRef.current.value=null }}> Delete custom values</button>
            <br></br>
            Customize X value  <input type="color" value={xValuesText.color} onChange={e => {var a={...xValuesText};a.color= e.target.value; setXValuesText(a)}}/>
          <input value={xValuesText.size} onChange={e => {var a={...xValuesText};a.size= e.target.value; if(!isNaN(Number(e.target.value)))  setXValuesText(a) }}/>
          <select value={xValuesText.font} onChange={e => {var a={...xValuesText};a.font= e.target.value; setXValuesText(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={ () => setXValuesText({font:"Arial",size:15,color:"#000000"})}> Reset to default</button>
          <br></br>
          Customize Y value  <input type="color" value={yValuesText.color} onChange={e => {var a={...yValuesText};a.color= e.target.value; setYValuesText(a)}}/>
          <input value={yValuesText.size} onChange={e => {var a={...yValuesText};a.size= e.target.value; if(!isNaN(Number(e.target.value)))  setYValuesText(a) }}/>
          <select value={yValuesText.font} onChange={e => {var a={...yValuesText};a.font= e.target.value; setYValuesText(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={ () => setYValuesText({font:"Arial",size:15,color:"#000000"})}> Reset to default</button>

          <br></br>
          Customize scales  <input type="color" value={scalesText.color} onChange={e => {var a={...scalesText};a.color= e.target.value; setScalesText(a)}}/>
          <input value={scalesText.size} onChange={e => {var a={...scalesText};a.size= e.target.value; if(!isNaN(Number(e.target.value)))  setScalesText(a) }}/>
          <select value={scalesText.font} onChange={e => {var a={...scalesText};a.font= e.target.value; setScalesText(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={ () => setScalesText({font:"Arial",size:15,color:"#000000"})}> Reset to default</button>

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
          customize line
          <input value={line.size} onChange={e => {var a={...line};a.size= e.target.value; if(!isNaN(Number(e.target.value)))  setLine(a) }}/>
          <input value={line.pointSize} onChange={e => {var a={...line};a.pointSize= e.target.value; if(!isNaN(Number(e.target.value)))  setLine(a) }}/>
          <button onClick={ () => setLine({pointSize:3,size: 1})}> Reset to default</button>

          <br></br>
          </div>
            <LineGraphCanvas fieldsObejct= {fields} boolDisplayXLines = {boolDisplayXLines}  boolDisplayYLines = {boolDisplayYLines} title={lineGraphTitle} 
            canvasSizeX={canvasSizeX} canvasSizeY={canvasSizeY} xValues={xValues} xValuesText={xValuesText} yValuesText={yValuesText} scalesText={scalesText}
             line={line} xName={xName}  yName={yName} titleText={titleText} customMax={customMax} customMin={customMin} grid={grid} boolCustomColors={boolCustomColors}
             boolDisplayNames={boolDisplayNames} boolDisplayLines={boolDisplayLines} canvasColor={canvasColor}/>
        </div>
    )
}

export default LineGraph;


 
      
      

    
            
          
             
              
            
          
          
          
       
       
   
   