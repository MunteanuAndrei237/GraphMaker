import { useRef, useEffect } from "react";

function turnValuetoArc(v, vt) {
  return (v / vt) * 2 * Math.PI;
}



function PieChartCanvas(props) {
  var myCanvas = useRef(null);
  var canvasXSize=Number(props.canvasSize);
  var canvasYSize=Number(props.canvasSize+Number(props.titleText.size));
  var pieChartXSize=canvasXSize*0.7;
  var pieChartYSize=canvasYSize*0.7;
  var xPadding=(canvasXSize-pieChartXSize)/2;
  var yPadding=(canvasYSize-pieChartYSize)/2;
 

  const draw = (ctx) => {
    var totalValue = 0;

    props.fieldsObejct.forEach((element) => {
      totalValue += element.pieValue;
    });

    var startAngle = 0;
    var finishAngle = 0;
    var pieChartRadius = pieChartXSize / 2;
    var pieChartCenterX = xPadding + pieChartXSize / 2;
    var pieChartCenterY = yPadding + pieChartYSize / 2;

    ctx.fillStyle = props.canvasColor;
    ctx.fillRect(0, 0, canvasXSize, canvasYSize);

    ctx.fillStyle = props.titleText.color;
    ctx.font =  props.titleText.size+ "px "+ props.titleText.font;
    ctx.fillText(props.title, xPadding + (pieChartXSize - ctx.measureText(props.title).width)/2 , Number(props.titleText.size));
   
  
    props.fieldsObejct.forEach((element) => {
      
        if(props.boolCustomColors)
      ctx.fillStyle = element.pieCustomColor;
        else
      ctx.fillStyle = element.pieColor;


      ctx.beginPath();
      finishAngle = startAngle + turnValuetoArc(element.pieValue, totalValue);
      ctx.arc(pieChartCenterX, pieChartCenterY, pieChartRadius, startAngle, finishAngle);
      ctx.lineTo(pieChartCenterX, pieChartCenterY);
      ctx.fill();


      const midAngle = startAngle + (finishAngle - startAngle) / 2;
      
      // Calculate the position outside the circle
      var textXInside = pieChartCenterX + pieChartRadius* 0.55 * Math.cos(midAngle);
      var textYInside = pieChartCenterY + pieChartRadius * 0.55 * Math.sin(midAngle);
      
      var textXOutside = pieChartCenterX + pieChartRadius* 1.1 * Math.cos(midAngle);
      var textYOutside = pieChartCenterY + pieChartRadius * 1.1 * Math.sin(midAngle);
      
      var textX;
          var textY;
          if(props.boolNameInside)
          {
            textX=textXInside;
            textY=textYInside;
          }
        else
          {
            textX=textXOutside;
            textY=textYOutside;
          }
     

      if(midAngle>Math.PI/2 && midAngle<Math.PI*3/2)
         {

          ctx.fillStyle = props.namesText.color;
          ctx.font = props.namesText.size+"px "+ props.namesText.font;

          

          ctx.fillText(element.pieName,textX-ctx.measureText(element.pieName).width,textY);

          ctx.fillStyle = props.valuesText.color;
          ctx.font = props.valuesText.size+"px "+ props.valuesText.font;
          if (props.boolDisplayValue)
          ctx.fillText(element.pieValue,textX,textY);
          if ( props.boolDisplayPercent)
          ctx.fillText(Math.round(element.pieValue/totalValue*100)+"%",textX,textY);
         }
      else
          {
            ctx.fillStyle = props.namesText.color;
          ctx.font = props.namesText.size+"px "+ props.namesText.font;
            ctx.fillText(element.pieName,textX,textY);

            ctx.fillStyle = props.valuesText.color;
          ctx.font = props.valuesText.size+"px "+ props.valuesText.font;
            if (props.boolDisplayValue)
          ctx.fillText(element.pieValue,textX+ctx.measureText(element.pieName).width,textY);
          if ( props.boolDisplayPercent)
          ctx.fillText(Math.round(element.pieValue/totalValue*100)+"%",textX+ctx.measureText(element.pieName).width+3,textY);
          }
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
