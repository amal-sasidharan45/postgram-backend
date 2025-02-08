    
    const multer=require('multer')

    
    const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}


// FwOWu2U0HmtlTpZ8

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      console.log(file);
      
        const isValid=MIME_TYPE_MAP[file.mimetype];
        let error=new Error(' Invalid mime  type');
        if(isValid){
            error=null
        }
        cb(error,'./images');
        },
        filename:(req,file,cb)=>{
            const name=file.originalname.toLowerCase().split(' ').join('-')
            console.log(name);
            
            const ext=MIME_TYPE_MAP[file.mimetype];
            cb(null, name + '-' + Date.now() + '.' + ext);
        }       
})
module.exports=multer({storage:storage}).single("image")
