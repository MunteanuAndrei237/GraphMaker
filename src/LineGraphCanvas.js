import { useRef , useEffect} from "react";

function turnValueToYPixels(value,range,canvasY,minValue)
{
    return canvasY-(value-minValue)/range*canvasY;
}

function LineGraphCanvas(props)
{
  
    var myCanvas = useRef(null);

    const draw = (ctx) => {
        var dimx=props.canvasSizeX;
        var dimy=props.canvasSizeY;
        var canvasX=dimx*0.7;
        var canvasY=dimy*0.7;
        var paddingX=dimx * 0.1;
        var paddingY=dimy*0.2;

        var pointRadius=props.line.pointSize;
        var cubeSize=10;
        var minValue=2**32;
        var maxValue=-(2**32)

        props.fieldsObejct.forEach(array => { 
            array.lineGraphYValues.forEach(element => {
            minValue=Math.min(minValue,element);
            maxValue=Math.max(maxValue,element);
            });
        });

        if (props.customMin!==null)
            minValue=props.customMin;
        else
        {
            props.fieldsObejct.forEach(array => { 
                array.lineGraphYValues.forEach(element => {
                minValue=Math.min(minValue,element);
                });
            });
        }
        if (props.customMax!==null)
            maxValue=props.customMax;
        else
        {
            props.fieldsObejct.forEach(array => { 
                array.lineGraphYValues.forEach(element => {
                maxValue=Math.max(maxValue,element);
                });
            });
        }

        var xJump=canvasX/(props.xValues.length);//you can add padding 


        var range=maxValue-minValue;    
        maxValue+=1;
        
        ctx.fillStyle = props.canvasColor;
        ctx.fillRect(0, 0, dimx, dimy);
       
        var scales=5;
        if(range<scales)
            scales=range;
        var scale=Math.ceil(range/scales);
        var newMax=minValue+scales*scale;

        ctx.fillStyle = props.titleText.color;
        ctx.font = props.titleText.size +"px "+ props.titleText.font;
        ctx.fillText(props.title,paddingX+ (canvasX - ctx.measureText(props.title).width)/2 ,Number(props.titleText.size));


        ctx.strokeStyle="#000000";
        ctx.fillStyle = props.xValuesText.color;
        ctx.font = props.xValuesText.size +"px "+ props.xValuesText.font;
        props.xValues.forEach((element,index) => {
        
        ctx.fillText(element,paddingX + xJump*(index+0.5)-ctx.measureText(element).width/2 , paddingY + canvasY + Number(dimy - paddingY - canvasY - props.xValuesText.size)/2 + Number(props.xValuesText.size));
        
        
        ctx.strokeStyle = props.grid.color;
        ctx.lineWidth = props.grid.size;

        if(props.boolDisplayYLines)
            {
                ctx.beginPath();
                ctx.moveTo(paddingX + xJump*(index+0.5),paddingY);
                ctx.lineTo(paddingX + xJump*(index+0.5),paddingY+canvasY);
                ctx.stroke();
            }
        })

       
        for(var i=0;i<=scales;i++)
        {
            ctx.fillStyle = props.scalesText.color;
            ctx.font = props.scalesText.size +"px "+ props.scalesText.font;
            ctx.fillText(minValue+scale*i, (paddingX-ctx.measureText(minValue+scale*i).width)/2 ,5 + paddingY +  canvasY-canvasY*i/scales);

            if(props.boolDisplayXLines)
                {
                    ctx.beginPath();
                    ctx.moveTo(paddingX,paddingY +  canvasY-canvasY*i/scales);
                    ctx.lineTo(paddingX+canvasX,paddingY +  canvasY-canvasY*i/scales);
                    ctx.stroke();
                }
            
        }
        
       

        
        ctx.font = props.yValuesText.size +"px "+ props.yValuesText.font;
        ctx.lineWidth = props.line.size;
        
        props.fieldsObejct.forEach(array => {
            array.lineGraphYValues.forEach((element,index) => {
            let element2;
            if(props.boolCustomColors)
            ctx.strokeStyle = array.lineGraphCustomColor;
            else
            ctx.strokeStyle = array.lineGraphColor;
            ctx.beginPath();
            ctx.moveTo(paddingX + xJump*(index+0.5),paddingY + turnValueToYPixels(element,newMax-minValue,canvasY,minValue));
            if (index!==props.xValues.length-1)
                {
                element2=array.lineGraphYValues[index+1];
                ctx.lineTo(paddingX + xJump*(index+1.5),paddingY+ turnValueToYPixels(element2,newMax-minValue,canvasY,minValue));
                }
            if(props.boolCustomColors)
            ctx.fillStyle = array.lineGraphCustomColor;
            else
            ctx.fillStyle = array.lineGraphColor;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(paddingX+ xJump*(index+0.5),paddingY + turnValueToYPixels(element,newMax-minValue,canvasY,minValue), pointRadius, 0, 2 * Math.PI);
            ctx.fill();

        });

            if(props.fieldsObejct.length>1)
            {
            ctx.fillRect(paddingX+canvasX+10,paddingY+(array.index-1)*30,cubeSize,cubeSize);
            ctx.fillStyle = props.yValuesText.color;
            ctx.fillText(array.lineGraphName,paddingX+canvasX+cubeSize+10,paddingY+(array.index-1)*30+cubeSize);
            }
    
    });
    if(props.boolDisplayNames)
    {
        ctx.font = "bold "+ Number(props.xValuesText.size) +"px "+ props.xValuesText.font;
        ctx.fillText(props.xName, paddingX + canvasX , paddingY + canvasY + Number(dimy - paddingY - canvasY - props.xValuesText.size)/2 +  Number(props.xValuesText.size)-2);
        ctx.font = "bold "+ props.scalesText.size +"px "+ props.xValuesText.font;console.log()
        ctx.fillText(props.yName, (paddingX-ctx.measureText(props.yName).width)/2 ,(paddingY + Number(props.scalesText.size))/2);
    }
    if(props.boolDisplayLines)
    {
        ctx.strokeStyle = props.grid.color;   
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(paddingX,paddingY);
        ctx.lineTo(paddingX,paddingY+canvasY);
        
        ctx.lineTo(paddingX+canvasX,paddingY+canvasY); 
        ctx.stroke();
    }
    }
    


    useEffect(() => {
        const canvas = myCanvas.current;
        const context = canvas.getContext("2d");
    
        //Our draw come here
        draw(context);
      },);
      
    return (
        <canvas height={props.canvasSizeY} width={props.canvasSizeX} ref= {myCanvas}></canvas>
    )
}

export default LineGraphCanvas;


//add scaling system