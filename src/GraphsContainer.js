
import Graph from './Graph.js';

function GraphsContainer(props)
{
    return (
        <div id="GraphsContainer">
           {props.graphsArray.map((graph,index) => {
                return(
            <Graph key={index} graphString={graph} />
                )
        })}
        </div>
    )
}

export default GraphsContainer;