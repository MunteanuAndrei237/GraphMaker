import Graph from './Graph.js';
import { useState } from 'react';
import { CgAddR } from 'react-icons/cg';

function OpenNewGraphform()
{
    
}



function GraphsContainer()
{
    const [graphsArray,setgraphsArray] = useState([]);

    function addGraphToArray()
    {
        setgraphsArray([...graphsArray,document.getElementById("chartType").value])
    }

    return (
        <div id="GraphsContainer">
            create new graph<CgAddR onClick={() => OpenNewGraphform()} />

            <select id="chartType">
        <option value="pieChart">Pie Chart</option>
        <option value="barGraph">Bar Graph</option>
        <option value="lineGraph">Line Graph</option>
        
    </select>
    <button onClick={()=> addGraphToArray()}>Create</button>
            {graphsArray.map((graph,index) => {
                return(
            <Graph key={index} graphString={graph} />
                )
        })}
            
                
        </div>
    )
}

export default GraphsContainer;