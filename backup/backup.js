const mongoose = require('mongoose');
const path = require('path')
const fs = require('fs')
const moment = require('moment')
const cron = require('node-cron');

// Yedekleme dizini
const baseBackupDir = path.join(__dirname, 'backup');


// Yedekleme işlemini gerçekleştir
const backup = async (req,res,next) => {
  
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
   
    // Model adlarını burada alıyoruz.
    const modelsName = mongoose.modelNames(); 

    // Tarih
    const currentDate = moment().format('DD-MM-YYYY');

    // Günlük yedekleme dizini adını belirtiyoruz.
    const backupDir = `${baseBackupDir}/${currentDate}`;

    // Günlük yedekleme dizinini oluştur
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const models = modelsName.map((dt) => {
      const Model = mongoose.model(dt);
      return Model.find().lean();
    });


    Promise.all(models)
    .then((results) => {
      results.forEach((documents, index) => {
        const dt = modelsName[index];
        const jsonData = JSON.stringify(documents, null, 2);
        const filePath = `${backupDir}/${dt}.json`;

        fs.writeFile(filePath, jsonData, (err) => {
          if (err) {
            console.error(`Dosyaya yazma hatası (${dt}):`, err);
          } else {
            console.log(`Veriler "${filePath}" dosyasına kaydedildi.`);
          }
        });
      });
    })
    .catch((err) => {
      console.error('Belgeleri alma hatası:', err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
      
      
  })

}

cron.schedule('0 0 0 * * *', () => { //her gece saat 12
  backup(); ///yedekle
});

module.exports={
  backup,
}