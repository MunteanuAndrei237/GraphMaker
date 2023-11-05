import { useRef, useEffect } from "react";

function turnValuetoArc(v, vt) {
  return (v / vt) * 2 * Math.PI;
}



function PieChartCanvas(props) {
  var myCanvas = useRef(null);
  var canvasXSize=Number(props.canvasSize);
  var canvasYSize=Number(props.canvasSize+30);
  var pieChartXSize=canvasXSize*0.8;
  var pieChartYSize=canvasYSize*0.8;
  console.log(canvasXSize);
  const draw = (ctx) => {
    var totalValue = 0;

    props.fieldsObejct.forEach((element) => {
      totalValue += element.pieValue;
    });

    var startAngle = 0;
    var finishAngle = 0;
    var pieChartRadius = pieChartXSize / 2;
    var pieChartCenterX = canvasXSize / 2;
    var pieChartCenterY = canvasYSize / 2;
    ctx.clearRect(0, 0, canvasXSize, canvasYSize);

    ctx.font = "20px Arial";
    ctx.fillText(props.title, 0, 30);
   
    ctx.font = "15px Arial";
    props.fieldsObejct.forEach((element) => {
      
      ctx.fillStyle = element.pieColor;

      ctx.beginPath();
      finishAngle = startAngle + turnValuetoArc(element.pieValue, totalValue);
      ctx.arc(pieChartCenterX, pieChartCenterY, pieChartRadius, startAngle, finishAngle);
      ctx.lineTo(pieChartCenterX, pieChartCenterY);
      ctx.fill();


      const midAngle = startAngle + (finishAngle - startAngle) / 2;
      console.log("mid angle",midAngle,element.pieName)
      // Calculate the position outside the circle
      const textX = pieChartCenterX + pieChartRadius* 1.05 * Math.cos(midAngle);
      const textY = pieChartCenterY + pieChartRadius * 1.05 * Math.sin(midAngle);
      ctx.fillStyle = "#000000";
      if(midAngle>Math.PI/2 && midAngle<Math.PI*3/2)
         {
          ctx.fillText(element.pieName,textX-ctx.measureText(element.pieName).width,textY);
          if (props.boolDisplayValue)
          ctx.fillText(element.pieValue,textX+3,textY);
          if ( props.boolDisplayPercent)
          ctx.fillText(Math.round(element.pieValue/totalValue*100)+"%"+3,textX,textY);
         }
      else
          {
            ctx.fillText(element.pieName,textX,textY);
            if (props.boolDisplayValue)
          ctx.fillText(element.pieValue,textX+ctx.measureText(element.pieName).width+3,textY);
          if ( props.boolDisplayPercent)
          ctx.fillText(Math.round(element.pieValue/totalValue*100)+"%",textX+ctx.measureText(element.pieName).width+3,textY);
          }
      console.log(ctx.measureText(element.pieName).width)
      startAngle = finishAngle;
    });

  };

  useEffect(() => {
    const canvas = myCanvas.current;
    const context = canvas.getContext("2d");

    //Our draw come here
    draw(context);
  },); //can comment [draw]

  return <canvas height={canvasYSize} width={canvasXSize} ref={myCanvas}></canvas>;
}

export default PieChartCanvas;
