import { useEffect,forwardRef } from "react";

function turnValuetoArc(v, vt) {
  return (v / vt) * 2 * Math.PI;
}

const PieChartCanvas =forwardRef((props, ref) => {
  var legendXSize;
  props.boolLegend ? legendXSize=50 : legendXSize=0;
  var canvasXSize=Number(props.canvasSize);
  var canvasYSize=Number(props.canvasSize+Number(props.titleText.size)*0.3);
  var pieChartXSize=canvasXSize*(props.pieChartPercent/100);
  var pieChartYSize=canvasYSize*(props.pieChartPercent/100);
  var xPadding=(canvasXSize-pieChartXSize)/2;
  var yPadding=(canvasYSize-pieChartYSize)/2;

  canvasXSize+=legendXSize;

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
    var cubeSize=10;

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
      var textXInside = pieChartCenterX + pieChartRadius* 0.80 * Math.cos(midAngle);
      var textYInside = pieChartCenterY + pieChartRadius * 0.80 * Math.sin(midAngle);
      
      var textXOutside = pieChartCenterX + pieChartRadius* 1.25 * Math.cos(midAngle);
      var textYOutside = pieChartCenterY + pieChartRadius * 1.15* Math.sin(midAngle);
      
      var nameX;
      var nameY;
      var valueX;
      var valueY;

      var pieValueText;
      if (props.boolDisplayValue)
        pieValueText=element.pieValue;
    else if (props.boolDisplayPercent)
        pieValueText=Math.round(element.pieValue/totalValue*100)+"%";
    else
        pieValueText="";

      if(props.boolNameInside && props.boolValueInside){
        ctx.font = props.namesText.size+"px "+ props.namesText.font;
        nameX=textXInside-ctx.measureText(element.pieName).width/2;
        nameY=textYInside;
        ctx.fillText(pieValueText,valueX,valueY);
        valueX=textXInside-ctx.measureText(pieValueText).width/2;
        valueY=textYInside+Number(props.valuesText.size);
      }
      else if(props.boolNameInside && !props.boolValueInside){
        ctx.font = props.namesText.size+"px "+ props.namesText.font;
        nameX=textXInside-ctx.measureText(element.pieName).width/2;
        nameY=textYInside;
        ctx.fillText(pieValueText,valueX,valueY);
        valueX=textXOutside-ctx.measureText(pieValueText).width/2;
        valueY=textYOutside+Number(props.valuesText.size)/2;
      }
      else if (!props.boolNameInside && props.boolValueInside){
        ctx.font = props.namesText.size+"px "+ props.namesText.font;
        nameX=textXOutside-ctx.measureText(element.pieName).width/2;
        nameY=textYOutside;
        ctx.fillText(pieValueText,valueX,valueY);
        valueX=textXInside-ctx.measureText(pieValueText).width/2;
        valueY=textYInside+Number(props.valuesText.size)/2;
      }
      else{
        ctx.font = props.namesText.size+"px "+ props.namesText.font;
        nameX=textXOutside-ctx.measureText(element.pieName).width/2; 
        nameY=textYOutside;
        ctx.fillText(pieValueText,valueX,valueY);
        valueX=textXOutside-ctx.measureText(pieValueText).width/2;
        valueY=textYOutside+Number(props.valuesText.size);
      }


      
      if(!props.boolLegend)
      {
      ctx.fillStyle = props.namesText.color;
      ctx.font = props.namesText.size+"px "+ props.namesText.font;
      ctx.fillText(element.pieName,nameX,nameY);
      }
    else
    {   
      ctx.fillRect(xPadding+pieChartXSize+canvasXSize*0.02,yPadding+element.index*30,cubeSize,cubeSize)
      ctx.fillStyle = props.legendText.color;
      ctx.font = props.legendText.size+"px "+ props.legendText.font;
      ctx.fillText(element.pieName,xPadding+pieChartXSize+cubeSize*1.25+canvasXSize*0.02,yPadding+element.index*30+Number(props.namesText.size));
    }

      ctx.fillStyle = props.valuesText.color;
      ctx.font = props.valuesText.size+"px "+ props.valuesText.font;
      ctx.fillText(pieValueText,valueX,valueY);
    
          
      startAngle = finishAngle;
    });

  };

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    //Our draw come here  
    draw(context);
  },); //can comment [draw]

  return <canvas height={canvasYSize} width={canvasXSize} ref={ref} ></canvas>;
})

export default PieChartCanvas;