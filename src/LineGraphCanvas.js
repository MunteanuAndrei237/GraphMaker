import { useRef , useEffect} from "react";

function turnValueToYPixels(v,sc,dimy,minValue)
{
    return dimy-(v-minValue)/sc*dimy;
}

function LineGraphCanvas(props)
{
  
    var myCanvas = useRef(null);

    const draw = (ctx) => {
        var dimx=500;
        var dimy=250;
        var minValue=2**32;
        var maxValue=-(2**32)
        props.fieldsObejct.forEach(element => {
            minValue=Math.min(minValue,element.lineGraphYValue);
            maxValue=Math.max(maxValue,element.lineGraphYValue);
        });
        var graphx=450;
        var graphy=220;
        var xJump=(graphx-20)/(props.fieldsObejct.length);//you can add padding 

        var range=maxValue-minValue;    
        
        

        maxValue+=1;
       

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,0,dimx+100,dimy);

        var scales=5;
        if(range<scales)
            scales=range;
        var scale=Math.ceil(range/scales);
        var newMax=minValue+scales*scale;
        console.log(newMax)
        for(var i=0;i<=scales;i++)
        {
            ctx.fillStyle = "#000000";
            ctx.font = "10px Arial";
            ctx.fillText(minValue+scale*i, 10, dimy-30-(dimy-30)*i/scales+9);
            console.log(minValue+scale*i, 10, dimy-30-(dimy-30)*i/scales+9)

            if(props.boolDisplayXLines)
                {
                    ctx.beginPath();
                    ctx.moveTo(10,dimy-30-(dimy-30)*i/scales);
                    ctx.lineTo(500,dimy-30-(dimy-30)*i/scales);
                    ctx.stroke();
                }
            
        }

        props.fieldsObejct.forEach(element => {
            let element2;
            
            
           

            ctx.beginPath();
            ctx.moveTo(xJump*(element.index-1)+60,turnValueToYPixels(element.lineGraphYValue,newMax-minValue,graphy,minValue));
            if (element.index!==props.fieldsObejct.length)
                {
                element2=props.fieldsObejct[element.index]
                ctx.lineTo(xJump*(element2.index-1)+60,turnValueToYPixels(element2.lineGraphYValue,newMax-minValue,graphy,minValue));
                }
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(xJump*(element.index-1)+60,turnValueToYPixels(element.lineGraphYValue,newMax-minValue,graphy,minValue), 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#000000";
            ctx.font = "15px Arial";
            ctx.fillText(element.lineGraphXValue, xJump*(element.index-1)+50, 245);
            if(props.boolDisplayYLines)
                {
                    ctx.beginPath();
                    ctx.moveTo(xJump*(element.index-1)+60,0);
                    ctx.lineTo(xJump*(element.index-1)+60,230);
                    ctx.stroke();
                }

        });
    }



    useEffect(() => {
        const canvas = myCanvas.current;
        const context = canvas.getContext("2d");
    
        //Our draw come here
        draw(context);
      },);
      
    return (
        <canvas height={"250px"} width={"600px"} ref= {myCanvas}></canvas>
    )
}

export default LineGraphCanvas;


//add scaling system