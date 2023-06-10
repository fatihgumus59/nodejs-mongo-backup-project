const {backup} = require('../backup/backup');

const getBackup = async (req,res,next)=>{
    try {
               
        await backup();

        res.status(200).json({ message: 'Yedekleme tamamlandı' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Yedekleme hatası' });
    }
};


module.exports=({
    getBackup,

})