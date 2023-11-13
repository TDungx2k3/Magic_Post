const express = require('express');

const cors = require('cors');

const app = express();
// Import routes
const route = require("./routes/indexRoute"); 

const leaderCon = require('./controllers/leaderController')
const transactionManager = require("./controllers/transactionManager")

app.use(express.json());


app.use(cors());

route(app);

app.listen(8080, async () => {
    console.log("Server is running on port 8080");
    try {
        const orderReceiveResult = await transactionManager.showAllOrderReceive();
        console.log(orderReceiveResult);
    } catch (err) {
        console.error(err);
    }
});


// Nghien cuu sau
process.on('exit', async () => {
    // Chỉ đóng kết nối cơ sở dữ liệu khi ứng dụng tắt
    console.log('Đang đóng kết nối cơ sở dữ liệu...');
    await sequelize.close();
    console.log('Kết nối cơ sở dữ liệu đã đóng.');
});