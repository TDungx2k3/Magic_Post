const express = require('express');

const cors = require('cors');

const app = express();
// Import routes
const route = require("./routes/indexRoute"); 

const leaderCon = require('./controllers/leaderController');
const transactionManager = require("./controllers/transactionManager");
const gatheringMangager = require('./controllers/gatheringManagerController');

app.use(express.json());


app.use(cors());

route(app);

app.listen(8080, async () => {
    console.log("Server is running on port 8080");
    
    // try {
    //     const maxGatherId = await leaderCon.getMaxGatherId();
    //     console.log("Max Gather ID:", maxGatherId);
    // } catch (error) {
    //     console.error("Error getting Max Gather ID:", error);
    // }

    // try {
    //     const maxTransactionId = await leaderCon.createTran();
    //     console.log("Max Transaction ID:", maxTransactionId);
    // } catch (error) {
    //     console.error("Error getting Max Transaction ID:", error);
    // }

    // try {
    //     const maxTransId = await transactionManager.getMaxTransId();
    //     console.log("Max Transaction ID:", maxTransId);
    // } catch (error) {
    //     console.error("Error getting Max Transation ID:", error);
    // }

    // try {
    //     await transactionManager.createAccountEmployee();
    // } catch (err) {
    //     console.error("ERRORRRRRRRRRRRRRRRR" + err);
    // }
    gatheringMangager.test();
});



// Nghien cuu sau
process.on('exit', async () => {
    // Chỉ đóng kết nối cơ sở dữ liệu khi ứng dụng tắt
    console.log('Đang đóng kết nối cơ sở dữ liệu...');
    await sequelize.close();
    console.log('Kết nối cơ sở dữ liệu đã đóng.');
});