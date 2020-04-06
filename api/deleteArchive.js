/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const oldusermodel = require('./database/models/oldUserModel')
const cron = require('node-cron')

/************************
 *                      *
 *     Tache Cron       *
 *                      *
 ************************/

const deleteArchive = cron.schedule(' 0 10 1 * *', async () => {
    //chaque premier du mois a 10h
    const d = new Date()
    const year = d.getFullYear()
    const month = d.getMonth() +1
    const day = d.getDate()
    const maxArchive = year -2 
    //definition a deux ans de la conservation des archives
    const archiveToDelete = await oldusermodel.find({archiveDate: {$lt: maxArchive + ',' + month + ',' + day}})
    
    
    for (let i = 0; i < archiveToDelete.length; i++) {
        const archive = archiveToDelete[i];
        archive.remove()
 }


})
