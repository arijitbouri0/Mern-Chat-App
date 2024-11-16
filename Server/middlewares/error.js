const errorMiddleware = (err,req,res,next) =>{
    err.message ||="Internal Server Error"
    err.statusCode ||= 500;

    if(err.code===1100){
        const error=Object.keys(err.keyPattern).join(",");
        err.message=`Duplicate field - ${error}`;
        err.statusCode=400
    }

    if(err.name==="CastError"){
        const errorPath=err.path
        err.message=`Invalid form of ${errorPath}`,
        err.statusCode=400
    }
    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
};


export {errorMiddleware};