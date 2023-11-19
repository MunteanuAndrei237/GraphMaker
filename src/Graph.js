import PieChart from './PieChart.js';
import BarGraph from './BarGraph.js';
import LineGraph from './LineGraph.js';


function Graph(props) {
  return (
    props.graphString === "pieChart" || props.graphString === "barGraph" || props.graphString === "lineGraph" ?
      <div className="GraphContainer">
        {props.graphString === "pieChart" ? <PieChart /> : props.graphString === "barGraph" ? <BarGraph /> : props.graphString === "lineGraph" ? <LineGraph /> : null}
      </div>
    : null
  );
}

export default Graph;
