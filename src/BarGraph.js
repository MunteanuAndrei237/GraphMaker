
import  { useState,useRef,useReducer } from "react";
import { CgAddR } from 'react-icons/cg';
import { FaTrash } from 'react-icons/fa';
import BarGraphCanvas from './BarGraphCanvas.js';

var vectorFillColors=['0','#FF0000','#00FF00','#0000FF','#FFFF00','#00FFFF','#FF00FF','#C0C0C0','#808080','#800000','#808000','#008000','#800080','#008080','#000080','#FFFFFF']
var vectorFillColors2=['0','#FF0000','#00FF00','#0000FF','#FFFF00','#00FFFF','#FF00FF','#C0C0C0','#808080','#800000','#808000','#008000','#800080','#008080','#000080','#FFFFFF']

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

function BarGraph()
{

    var minRef=useRef(null);
    var maxRef=useRef(null);

    var globalMax=180;
    var globalMin=160;
    var globalMaxComposed=185;
    var globalMinComposed=150;

    const initialComposed=[{index:1,composedName:"european",composedColor:vectorFillColors2[1],composedCustomColor:vectorFillColors2[1]},
                           {index:2,composedName:"asian",composedColor:vectorFillColors2[2],composedCustomColor:vectorFillColors2[2]}]
    const initialFields = [
      { index: 1, barGraphName: "male", barGraphValue: 180,barGraphColor:vectorFillColors[1],barGraphArray:[175,185],barGraphCustomColor:vectorFillColors[1]},
      { index: 2, barGraphName: "female", barGraphValue: 160 ,barGraphColor:vectorFillColors[2],barGraphArray:[150,170],barGraphCustomColor:vectorFillColors[2] },
    ];

    function composedReducer(state,action)
    {
      switch(action.type)
      {
        case 'change':
                const { indexC, keyC, valueC } = action.payload;
                let newStateC =[...state]
                newStateC[indexC][keyC]=valueC
                return newStateC
        case 'addComposed':
           const stateAC = [...state];
           stateAC.push({ index: state.length + 1, composedName: "", composedColor:vectorFillColors2[state.length + 1] , composedCustomColor:vectorFillColors2[state.length + 1]});
           return stateAC;
        case 'deleteComposed':
            const {deleteIndex} = action.payload;

            const stateDC = [...state];
            stateDC.splice(deleteIndex,1);
            stateDC.forEach((element,index) => {
            element.index=index+1;
            });
            return stateDC;
        case 'removeColor':
          const newStateR = [...state];
          newStateR.forEach(element => {
            element.composedColor=vectorFillColors2[element.index];
          });
          return newStateR;
        default:
          return state
      }
    }

    function fieldsReducer(state,action)
    {
        switch(action.type)
        {
          case 'add':
            return [...state,
              { index: state.length + 1, barGraphName: "", 
              barGraphValue: 0 ,
              barGraphColor:vectorFillColors[state.length + 1],
              barGraphArray:Array.from({ length: composed.length }, () => 0),
              barGraphCustomColor : vectorFillColors[state.length + 1]}
            ]
            case 'change':
              const { indexC, keyC, valueC } = action.payload;
              let newStateC =[...state]
              newStateC[indexC][keyC]=valueC
              return newStateC
            case 'number':
              const { indexN, keyN, valueN } = action.payload;
              let newStateN =[...state]
              if(!isNaN(Number(valueN)))
              {
                newStateN[indexN][keyN] = Number(valueN);
                globalMax=Math.max(globalMax,Number(valueN));
                globalMin=Math.min(globalMin,Number(valueN));
              }
              return newStateN;
            case 'array':
              const { indexA, keyA, valueA ,index2A } = action.payload;
              let newStateA =[...state]
              if(!isNaN(Number(valueA)))
              {
                newStateA[indexA][keyA][index2A] = Number(valueA);
                globalMaxComposed=Math.max(globalMaxComposed,Number(valueA));
                globalMinComposed=Math.min(globalMinComposed,Number(valueA));
              }
              return newStateA;
            case 'delete':
              const { deleteIndex } = action.payload;
              let newStateD =[...state]
              newStateD.splice(deleteIndex-1,1);
              newStateD.forEach((element,index) => {
              element.index=index+1;
              });
              return newStateD;
            case 'addComposed':
              let newStateAC =[...state]
              newStateAC.forEach(element => {
                while (element.barGraphArray.length < composed.length)
                  element.barGraphArray.push(0);
              });
              return newStateAC;
            case 'deleteComposed':
              const { deleteComposedIndex } = action.payload;
              let newStateDC =[...state]
              newStateDC = state.map((element) => {
              const newBarGraphArray = [...element.barGraphArray];
              newBarGraphArray.splice(deleteComposedIndex, 1);
              return { ...element, barGraphArray: newBarGraphArray };
              });
              return newStateDC;
            case 'removeColor':
            const newStateR = [...state];
            newStateR.forEach(element => {
              element.barGraphColor=vectorFillColors[element.index];
            });
            return newStateR;

            default:
              return state
        }

    }
      const [composed, composedDispatch] = useReducer(composedReducer, initialComposed);
      const [fields, fieldsDispatch] = useReducer(fieldsReducer, initialFields);

      const [canvasSizeX,setCanvasSizeX]=useState(700);
      const [canvasSizeY,setCanvasSizeY]=useState(300);
      const [canvasColor,setCanvasColor]=useState("#FFFFFF");

      
      const [boolShowLines,setBoolShowLines]=useState(false);
      const [boolDisplayValueOnBar,setBoolDisplayValueOnBar]=useState(false);
      const [boolCustomColors,setBoolCustomColors]=useState(false);
      const [boolComposedValues,setBoolComposedValues]=useState(false);
      const [boolSameColorForName,setBoolSameColorForName ]=useState(false);
      
      const [barGraphTitle,setBarGraphTitle]=useState("Population distribution by gender");
      const [customMin,setCustomMin]=useState(null);
      const [customMax,setCustomMax]=useState(null);

      const [fieldText,setFieldText]=useState({fieldTextColor: '#000000',fieldTextSize: 15,fieldTextFont: 'Arial'});
      const [fieldTextComposed,setFieldTextComposed]=useState({fieldTextColor: '#000000',fieldTextSize: 12,fieldTextFont: 'Arial'});
      const [fieldTextValue,setFieldTextValue]=useState({fieldTextColor: '#000000',fieldTextSize: 20,fieldTextFont: 'Arial'});
      const [fieldTextTitle,setFieldTextTitle]=useState({fieldTextColor: '#000000',fieldTextSize: 30,fieldTextFont: 'Arial'});
      const [fieldTextValueOnBar,setFieldTextValueOnBar]=useState({fieldTextColor: '#000000',fieldTextSize: 15,fieldTextFont: 'Arial'});
      const [line,setLine]=useState({color: '#000000',size: 1});

   
      
      function deleteField(ind)
      {
        var deletedColor=fields[ind-1].barGraphColor;
        vectorFillColors.splice(vectorFillColors.indexOf(deletedColor),1);
        vectorFillColors.splice(fields.length,0,deletedColor);
        fieldsDispatch({type:'delete',payload:{deleteIndex:ind}})
      }

      function handleMax(e)
      {
        if(e.target.value==="")
          {
            setCustomMax(null);
            return;
          }
          if(!boolComposedValues)
          {
            if(!isNaN(Number(e.target.value)) && Number(e.target.value)>=globalMax)
          {
            setCustomMax(Number(e.target.value));
          }
          else
              {
                alert("Choose a number greater than " +  globalMax );
                console.log("nu returneaza")
              }
          }
          else
          {
            if(!isNaN(Number(e.target.value)) && Number(e.target.value)>=globalMaxComposed)
            {
              setCustomMax(Number(e.target.value));
            }
            else
                alert("Choose a number greater than " +  globalMaxComposed );
          }
      }

      function handleMin(e)
      {
          if(e.target.value==="")
          {
            setCustomMin(null);
            return;
          }
          if(!boolComposedValues)
          {
            if(!isNaN(Number(e.target.value)) && Number(e.target.value)<=globalMin)
          {
            setCustomMin(Number(e.target.value));
          }
          else
              alert("Choose a number smaller than " +  globalMin);
          }
          else
          {
            if(!isNaN(Number(e.target.value)) && Number(e.target.value)<=globalMinComposed)
            {
              setCustomMin(Number(e.target.value));
            }
            else
                alert("Choose a number smaller than " +  globalMinComposed);
          }
      }


      function changeComposedValuesState()
      {
        setBoolComposedValues(!boolComposedValues);
        if(boolComposedValues)
        {
              if(customMax<globalMaxComposed)
                setCustomMax(globalMaxComposed);
              if(customMin>globalMinComposed)
                setCustomMin(globalMinComposed);
        }
        else
        {
          if(customMax<globalMax)
            setCustomMax(globalMax);
          if(customMin>globalMin)
            setCustomMin(globalMin);
        }
      }
    

      function deleteComposedField(ind)
      {
        var deletedColor=composed[ind-1].composedColor;
        vectorFillColors2.splice(vectorFillColors2.indexOf(deletedColor),1);
        vectorFillColors2.splice(composed.length,0,deletedColor);
        fieldsDispatch({type:'deleteComposed',payload:{deleteComposedIndex:ind}})
        composedDispatch({type:'deleteComposed',payload:{deleteIndex:ind}})
      }

      console.log(fields)

      return (
        <div className="barGraphContainer">
        <div className="barGraphForm">
            Title:<input placeholder="Yout title here" value={barGraphTitle} onChange={e => setBarGraphTitle(e.target.value)}></input>

            {
              boolComposedValues ?
              <div>
                Enter your composed values h: 
                {composed.map((field,index) => (
                  <div key={field.index} display="inline" >
                  <input 
                  className="barGraphComposedValue"
                  value={field.composedName}
                  onChange={(e) => { composedDispatch({type:'change',payload:{indexC:index,keyC:'composedName' ,valueC:e.target.value} })  }}
                  maxLength="22"

                  />
                  {boolCustomColors ?
                  <input 
                  type="color"
                  value={field.composedCustomColor }
                  onChange={(e) =>  { composedDispatch({type:'change',payload:{indexC:index,keyC:'composedCustomColor' ,valueC:e.target.value} })}}

                  /> : null
                  }
                  <FaTrash onClick={() => composed.length!==1 ? deleteComposedField(index) : null } />
                  </div>
                ))}
                 <CgAddR  display="inline" onClick={() => {fieldsDispatch({type:'addComposed'}) 
                                                          composedDispatch({type:'addComposed'})}} />
              </div>
                : null
            }
          {fields.map((field) => (
            
            <div key={field.index}> Field {field.index}
              <input
                placeholder={"Field name"}
                className="barGraphName"
                value={field.barGraphName}
                onChange={(e) => fieldsDispatch({ type:'change',payload:{indexC:field.index - 1,keyC: 'barGraphName',valueC: e.target.value}})}
                maxLength="22"
              />
              { !boolComposedValues ?
              <input
                className="barGraphValue"
                value={field.barGraphValue}
                onChange={(e) => fieldsDispatch({ type:'number',payload:{indexN:field.index - 1,keyN: 'barGraphValue',valueN: e.target.value}})}
                maxLength="22"
              /> : 
              composed.map((composedField,composedIndex) => (
                <input
                key={composedIndex}
                display="inline"
                className="barGraphValue"
                value={field.barGraphArray[composedIndex]}
                onChange={(e) => fieldsDispatch({ type:'array',payload:{indexA:field.index - 1,keyA: 'barGraphArray',valueA: e.target.value,index2A:composedIndex}})}
                maxLength="22"
              /> 
              ))
              }
               {boolCustomColors && !boolComposedValues ? 
              <input 
              type="color" 
              value={field.barGraphCustomColor } 
              onChange={(e) => fieldsDispatch({ type:'change',payload:{indexC:field.index - 1,keyC: 'barGraphCustomColor',valueC: e.target.value}})}
              /> : null}
             
              <FaTrash onClick={() => fields.length!==1 ? deleteField(field.index) : null} />
            </div>
          ))}
          Display lines <input type="checkbox" value={boolShowLines} onChange={()=> setBoolShowLines(!boolShowLines)} />
          Display value on bar <input type="checkbox" value={boolDisplayValueOnBar} onChange={()=> setBoolDisplayValueOnBar(!boolDisplayValueOnBar)} />
          Custom colors<input type="checkbox" id="po" onClick={()=>{setBoolCustomColors(!boolCustomColors);
                                                                    if(boolCustomColors)
                                                                    {
                                                                      fieldsDispatch({type:'removeColor'})
                                                                      composedDispatch({type:'removeColor'})
                                                                    }}}></input>
          Use same color for name<input type="checkbox" onClick={()=>setBoolSameColorForName(!boolSameColorForName)}></input>
          Composed values <input type="checkbox" onClick={()=>changeComposedValuesState()}></input>
          <br></br>
          Set canvas size X <input  value={canvasSizeX}  onChange={e=> !isNaN(Number(e.target.value)) ? setCanvasSizeX( Number(e.target.value)) : null }></input>
          Set canvas size Y <input  value={canvasSizeY}  onChange={e=> !isNaN(Number(e.target.value)) ? setCanvasSizeY( Number(e.target.value)) : null }></input>
          Canavs color <input type="color" value={canvasColor} onChange={e => setCanvasColor(e.target.value)}/>
          <br></br>
          Custom min <input  ref={ minRef} onBlur ={e=> handleMin(e) } ></input>
          Custom max <input ref={ maxRef}  onBlur ={e=> handleMax(e) } ></input>
          <button onClick={ () => {setCustomMax(null);setCustomMin(null);minRef.current.value=null;maxRef.current.value=null }}> Delete custom values</button>
          <br></br>
          Customize fields <input type="color" value={fieldText.fieldTextColor} onChange={e => {var a={...fieldText};a.fieldTextColor= e.target.value; setFieldText(a)}}/>
          <input value={fieldText.fieldTextSize} onChange={e => {var a={...fieldText};a.fieldTextSize= e.target.value; if(!isNaN(Number(e.target.value)))  setFieldText(a) }}/>
          <select value={fieldText.fieldTextFont} onChange={e => {var a={...fieldText};a.fieldTextFont= e.target.value; setFieldText(a)}}>
          {fontOptions.map((font, index) => ( 
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={()=>setFieldText({fieldTextColor: '#000000',fieldTextSize: 15,fieldTextFont: 'Arial'})} >Reset to default</button>
          <br></br>
          Customize composed <input type="color" value={fieldTextComposed.fieldTextColor} onChange={e => {var a={...fieldTextComposed};a.fieldTextColor= e.target.value; setFieldTextComposed(a)}}/>
          <input value={fieldTextComposed.fieldTextSize} onChange={e => {var a={...fieldTextComposed};a.fieldTextSize= e.target.value; if(!isNaN(Number(e.target.value)))  setFieldTextComposed(a) }}/>
          <select value={fieldTextComposed.fieldTextFont} onChange={e => {var a={...fieldTextComposed};a.fieldTextFont= e.target.value; setFieldTextComposed(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={()=>setFieldTextComposed({fieldTextColor: '#000000',fieldTextSize: 12,fieldTextFont: 'Arial'})} >Reset to default</button>
          <br></br>
          Customize values <input type="color" value={fieldTextValue.fieldTextColor} onChange={e => {var a={...fieldTextValue};a.fieldTextColor= e.target.value; setFieldTextValue(a)}}/>
          <input value={fieldTextValue.fieldTextSize} onChange={e => {var a={...fieldTextValue};a.fieldTextSize= e.target.value; if(!isNaN(Number(e.target.value)))  setFieldTextValue(a) }}/>
          <select value={fieldTextValue.fieldTextFont} onChange={e => {var a={...fieldTextValue};a.fieldTextFont= e.target.value; setFieldTextValue(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={()=>setFieldTextValue({fieldTextColor: '#000000',fieldTextSize: 20,fieldTextFont: 'Arial'})} >Reset to default</button>
          <br></br>
          Customize title <input type="color" value={fieldTextTitle.fieldTextColor} onChange={e => {var a={...fieldTextTitle};a.fieldTextColor= e.target.value; setFieldTextTitle(a)}}/>
          <input value={fieldTextTitle.fieldTextSize} onChange={e => {var a={...fieldTextTitle};a.fieldTextSize= e.target.value; if(!isNaN(Number(e.target.value)))  setFieldTextTitle(a) }}/>
          <select value={fieldTextTitle.fieldTextFont} onChange={e => {var a={...fieldTextTitle};a.fieldTextFont= e.target.value; setFieldTextTitle(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={()=>setFieldTextTitle({fieldTextColor: '#000000',fieldTextSize: 30,fieldTextFont: 'Arial'})} >Reset to default</button>
          <br></br>
          Customize values on bar <input type="color" value={fieldTextValueOnBar.fieldTextColor} onChange={e => {var a={...fieldTextValueOnBar};a.fieldTextColor= e.target.value; setFieldTextValueOnBar(a)}}/>
          <input value={fieldTextValueOnBar.fieldTextSize} onChange={e => {var a={...fieldTextValueOnBar};a.fieldTextSize= e.target.value; if(!isNaN(Number(e.target.value)))  setFieldTextValueOnBar(a) }}/>
          <select value={fieldTextValueOnBar.fieldTextFont} onChange={e => {var a={...fieldTextValueOnBar};a.fieldTextFont= e.target.value; setFieldTextValueOnBar(a)}}>
          {fontOptions.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
          ))}
          </select>
          <button onClick={()=>setFieldTextValueOnBar({fieldTextColor: '#000000',fieldTextSize: 15,fieldTextFont: 'Arial'})} >Reset to default</button>
          <br></br>
          Customize line <input type="color" value={line.color} onChange={e => {var a={...line};a.color= e.target.value; setLine(a)}}/>
          <input value={line.size} onChange={e => {var a={...line};a.size= e.target.value; if(!isNaN(Number(e.target.value)))  setLine(a) }}/>
          <button onClick={()=>setLine({color: '#000000',size: 1})} >Reset to default</button>
          <br></br>
          <CgAddR onClick={() => fieldsDispatch({type:'add'})} />
          
        </div>
        <BarGraphCanvas fieldsObejct= {fields} boolShowLines={boolShowLines} boolDisplayValueOnBar={boolDisplayValueOnBar} composed={composed} 
        boolComposedValues={boolComposedValues} canvasSizeX={canvasSizeX } canvasSizeY={canvasSizeY} title={barGraphTitle} customMax={customMax} customMin={customMin}
        fieldText ={ fieldText } fieldTextComposed ={ fieldTextComposed } fieldTextValue={ fieldTextValue } fieldTextTitle={fieldTextTitle} fieldTextValueOnBar={fieldTextValueOnBar}
        line ={line} boolSameColorForName={boolSameColorForName} canvasColor={canvasColor} boolCustomColors={ boolCustomColors }/>
        </div>
      );

}
export default BarGraph;