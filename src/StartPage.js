import { Select,MenuItem,Button,InputLabel,FormControl  } from '@mui/material';
import myTheme from './myTheme.js';
import GraphsContainer from './GraphsContainer.js';
import { useState } from 'react';
import './startPage.css';
import { useRef } from 'react';

function StartPage()
{
    const [graphsArray,setgraphsArray] = useState([]);
    const [graphType,setgraphType] = useState('pieChart');
    const selectRef = useRef(null);
    console.log(graphsArray)
    return (
        <div id="wholePage">
            <div id="mainPage">
        <div id="mainsquare">
            <h1>Create your own graph in seconds</h1>
            <p>Choose between different type of graphs and customize them how you want.Choose between different type of graphs and customize them how you want.Choose between different type of graphs and customize them how you want.</p>

            <h3>Get started:</h3>
        <FormControl >
        <InputLabel >Select graph type</InputLabel>
            <Select  ref={selectRef} value={graphType} onChange={e=>{setgraphType(e.target.value)}}>
            
        <MenuItem value="pieChart">Pie Chart</MenuItem>
        <MenuItem value="barGraph">Bar Graph</MenuItem>
        <MenuItem value="lineGraph">Line Graph</MenuItem>
        
    </Select>
    </FormControl>
    <Button  variant='outlined' onClick={() => setgraphsArray([...graphsArray,graphType])}>Create new graph</Button>
           
            </div>
            </div>
            <GraphsContainer graphsArray={graphsArray}/>
        </div>
    )
    
}

export default StartPage;