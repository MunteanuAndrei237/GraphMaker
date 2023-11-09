import { useRef , useEffect} from "react";


function PieChartCanvas(props)
{
    var myCanvas=useRef(null);

    const draw = ctx => {
        
        var dimx=props.canvasSizeX;
        var dimy=props.canvasSizeY;
        var barGraphSizeX=dimx*0.7;
        var barGraphSizeY=dimy*0.7;
        var paddingX=(dimx-barGraphSizeX)/2;
        var paddingY=(dimy-barGraphSizeY)/2;
        var barWidth=barGraphSizeX/(props.fieldsObejct.length*2+1);
        var maxValue=0;
        var minValue=0;
        var cubeSize=10;
        var cubeJump=30;
        
        
        if (!props.boolComposedValues){
        props.fieldsObejct.forEach(element => {
            maxValue=Math.max(maxValue,element.barGraphValue);
        });
        }
        else
        {
            props.fieldsObejct.forEach(element => {
                element.barGraphArray.forEach(element2 => {
                    maxValue=Math.max(maxValue,element2);
                });
            });
        }

        if (props.customMin!==null)
            minValue=props.customMin;
        if (props.customMax!==null)
            maxValue=props.customMax;
        
        var range=maxValue-minValue;
        var numbersOfScale=Math.floor(Math.log10(range/2.5));
        
        var rounding;
        if(range<40)
            rounding=1;
        else if(range<250)
            rounding=5;
        else
            rounding=10**(numbersOfScale-1);
            range=Math.ceil(range/rounding/5)*rounding*5;
        
        var scales=5;
        var scale=Math.floor(Math.floor(range/scales)/rounding)*rounding;
        
        ctx.fillStyle = props.canvasColor;
        ctx.fillRect(0, 0, dimx, dimy);

        ctx.fillStyle =  props.fieldTextTitle.fieldTextColor;
        ctx.font = props.fieldTextTitle.fieldTextSize+"px "+ props.fieldTextTitle.fieldTextFont;
        ctx.fillText(props.title, paddingX + (barGraphSizeX-ctx.measureText(props.title).width)/2, props.fieldTextTitle.fieldTextSize);

        ctx.fillStyle = props.fieldTextValue.fieldTextColor;
        ctx.font = props.fieldTextValue.fieldTextSize+ "px "+ props.fieldTextValue.fieldTextFont;
        ctx.strokeStyle = props.line.color;
        ctx.lineWidth = props.line.size;
        for(var i=0;i<=scales;i++)
            {
                
                ctx.fillText(minValue+scale*i, (paddingX - ctx.measureText(minValue+scale*i).width)/2, paddingY + barGraphSizeY-(barGraphSizeY)*i*scale/range);
                if(props.boolShowLines)
                {
                    
                    ctx.beginPath();
                    ctx.moveTo(paddingX, paddingY + barGraphSizeY-(barGraphSizeY)*i*scale/range);
                    ctx.lineTo(paddingX + barGraphSizeX, paddingY + barGraphSizeY-(barGraphSizeY)*i*scale/range);
                    ctx.stroke();
                }
            }


            if(!props.boolComposedValues)
         props.fieldsObejct.forEach(element => {
            console.log(barWidth)
            let startingX=paddingX+barWidth*(2*element.index-1);
            let lenghtX=barWidth;
            let lenghtY=(element.barGraphValue-minValue)/range*(barGraphSizeY);
            let startingY= paddingY + barGraphSizeY - lenghtY;
            if(props.boolCustomColors)
                {ctx.fillStyle = element.barGraphCustomColor;
                    console.log(element.barGraphCustomColor)
                }
            else
                ctx.fillStyle = element.barGraphColor;
            ctx.fillRect(startingX,startingY,lenghtX,lenghtY);
            
            ctx.font = props.fieldText.fieldTextSize +"px "+  props.fieldText.fieldTextFont;
            if(!props.boolSameColorForName)
            ctx.fillStyle = props.fieldText.fieldTextColor;
            ctx.fillText(element.barGraphName, startingX + (barWidth-ctx.measureText(element.barGraphName).width)/2 , paddingY + barGraphSizeY+ Number(props.fieldText.fieldTextSize) + 5);

            if(props.boolDisplayValueOnBar)
            {
                ctx.fillStyle = props.fieldTextValueOnBar.fieldTextColor;
                ctx.font = props.fieldTextValueOnBar.fieldTextSize + "px " + props.fieldTextValueOnBar.fieldTextFont;
                ctx.fillText(element.barGraphValue, startingX + (barWidth-ctx.measureText(element.barGraphValue).width)/2 , startingY+(lenghtY+Number(props.fieldTextValueOnBar.fieldTextSize))/2);
            }
            
        }
        
        
        )
        else
        {
            props.fieldsObejct.forEach(element => {
            
                ctx.font = props.fieldText.fieldTextSize +"px "+  props.fieldText.fieldTextFont;
                ctx.fillStyle = props.fieldText.fieldTextColor;
                ctx.fillText(element.barGraphName, paddingX+ barWidth*(2*element.index-1) + (barWidth-ctx.measureText(element.barGraphName).width)/2 , paddingY + barGraphSizeY+ Number(props.fieldText.fieldTextSize) + 5);

                let lenghtX=barWidth/props.composed.length;
                props.composed.forEach((element2,index) => {
                let startingX=paddingX+ barWidth*(2*element.index-1)+lenghtX*index;
                let lenghtY=(element.barGraphArray[index]-minValue)/range*(barGraphSizeY);
                let startingY= paddingY + barGraphSizeY-lenghtY;
 
                if(props.boolCustomColors)
                ctx.fillStyle = element2.composedCustomColor;
                else
                ctx.fillStyle = element2.composedColor;

                ctx.fillRect(startingX,startingY,lenghtX,lenghtY);

               
                })
            })

            props.composed.forEach(element => {
                ctx.font = props.fieldTextComposed.fieldTextSize + "px "+ props.fieldTextComposed.fieldTextFont;
                ctx.fillStyle = props.fieldTextComposed.fieldTextColor;
                ctx.fillText(element.composedName, paddingX + barGraphSizeX + cubeSize + 3,paddingY+ (element.index-1)*cubeJump );

                if(props.boolCustomColors)
                {
                    ctx.fillStyle = element.composedCustomColor;
                    console.log("esti bine");
                }
                else
                ctx.fillStyle = element.composedColor;

                var cubeX= paddingX + barGraphSizeX;
                var cubeY=paddingY + (element.index-1)*cubeJump-cubeSize;
                ctx.fillRect(cubeX,cubeY,cubeSize,cubeSize);
            })
        }

    }
    
      useEffect(() => {
        
        const canvas = myCanvas.current
        const context = canvas.getContext('2d')
        
        //Our draw come here
        draw(context)
      }, )//can comment [draw]


    return (
        <canvas height={props.canvasSizeY} width={props.canvasSizeX} ref= {myCanvas}></canvas>
    )
}

export default PieChartCanvas;