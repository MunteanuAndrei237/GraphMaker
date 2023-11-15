import { Select,MenuItem,Button,InputLabel,FormControl  } from '@mui/material';
import GraphsContainer from './GraphsContainer.js';
import { useState } from 'react';
import './startPage.css';
import { useRef } from 'react';



function StartPage()
{
    const [graphsArray,setgraphsArray] = useState([]);
    const [graphType,setgraphType] = useState('pieChart');
    const selectRef = useRef(null);
    return (
        <div id="wholePage">
        <div id="mainPage">
        <div id="mainsquare">
            <h1>Create your own graph in seconds</h1>
            <p>Choose between different type of graphs and customize them how you want.Choose between different type of graphs and customize them how you want.Choose between different type of graphs and customize them how you want.</p>

            <h3>Get started:</h3>
        <FormControl >
        <InputLabel >Select graph type</InputLabel>
            <Select  ref={selectRef} value={graphType} onChange={e=>{setgraphType(e.target.value)}} label="Select graph type">
            
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
