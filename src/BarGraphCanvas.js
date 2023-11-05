import { useRef , useEffect} from "react";


function PieChartCanvas(props)
{
    var myCanvas=useRef(null);

    const draw = ctx => {
        
        var dimx=500;
        var dimy=250;
        var textDim=30;
        var barWidth=dimx/(props.fieldsObejct.length*2+2);

        var maxValue=0;
        //var minValue=0;//add custom scaling
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
        
        var numbersOfScale=Math.floor(Math.log10(maxValue/2.5));
        
        var rounding;
        if(maxValue<40)
            rounding=1;
        else if(maxValue<250)
            rounding=5;
        else
            rounding=10**(numbersOfScale-1);
        maxValue=Math.ceil(maxValue/rounding/5)*rounding*5;
        
        var scales=5;
        var scale=Math.floor(Math.floor(maxValue/scales)/rounding)*rounding;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,0,dimx+100,dimy);

        ctx.fillStyle = "#000000";

        
        for(var i=0;i<=scales+1;i++)
            {
                ctx.font = "10px Arial";
                ctx.fillText(scale*i, 0, dimy-textDim-(dimy-textDim)*i*scale/maxValue+9);
                if(props.boolShowLines)
                {
                    ctx.beginPath();
                    ctx.moveTo(0, dimy-textDim-(dimy-textDim)*i*scale/maxValue+1);
                    ctx.lineTo(dimx, dimy-textDim-(dimy-textDim)*i*scale/maxValue+1);
                    ctx.stroke();
                }
            }
            if(!props.boolComposedValues)
        props.fieldsObejct.forEach(element => {
            
            let startingX=barWidth*(2*element.index);
            let lenghtX=barWidth;
            let lenghtY=element.barGraphValue/maxValue*(dimy-textDim);
            let startingY= dimy-textDim-lenghtY;

            
            
            ctx.fillStyle = element.barGraphColor;
            ctx.fillRect(startingX,startingY,lenghtX,lenghtY);

            if(element.barGraphName.length<12)
            {
            ctx.font = Math.max((30-element.barGraphName.length*2),12)+"px Arial";
            ctx.fillText(element.barGraphName, startingX , dimy-5);
            }
            else
            {
                ctx.font = "12px Arial";
                ctx.fillText(element.barGraphName.substring(0,11), startingX , dimy-11);
                ctx.fillText(element.barGraphName.substring(11,element.barGraphName.length), startingX , dimy-1);
            }

            if(props.boolDisplayValueOnBar)
            {
                ctx.fillStyle = "#000000";
                ctx.font = Math.max((30-element.barGraphName.length*2),12);
                ctx.fillText(element.barGraphValue, startingX , startingY+lenghtY/2+5);
            }
            
        }
        
        
        )
        else
        {
            props.fieldsObejct.forEach(element => {
            
                
                let lenghtX=barWidth/props.composed.length;
                props.composed.forEach((element2,index) => {
                let startingX=barWidth*(2*element.index)+lenghtX*index;
                let lenghtY=element.barGraphArray[index]/maxValue*(dimy-textDim);
                let startingY= dimy-textDim-lenghtY;
 
                
                ctx.fillStyle = element2.composedColor;
                ctx.fillRect(startingX,startingY,lenghtX,lenghtY);

                if(index===0)
                {
                    ctx.fillStyle = "#000000";
                    if(element.barGraphName.length<12)
            {
            ctx.font = Math.max((30-element.barGraphName.length*2),12)+"px Arial";
            ctx.fillText(element.barGraphName, startingX , dimy-5);
            }
            else
            {
                ctx.font = "12px Arial";
                ctx.fillText(element.barGraphName.substring(0,11), startingX , dimy-11);
                ctx.fillText(element.barGraphName.substring(11,element.barGraphName.length), startingX , dimy-1);
            }
                }
                })
            })

            props.composed.forEach(element => {
                ctx.font = "12px Arial";
                ctx.fillStyle = element.composedColor;
                ctx.fillText(element.composedName, 510 , element.index*30);
                var cubeX=500;
                var cubeY=element.index*30-10;
                ctx.fillRect(cubeX,cubeY,10,10);
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
        <canvas height={"250px"} width={"600px"} ref= {myCanvas}></canvas>
    )
}

export default PieChartCanvas;