import express from "express"
import dotenv from "dotenv"
import errorHandler from "./middlewares/errorHandling.js";
import connectDB from "./config/db.js";
import itemsRoutes from "./routes/items.routes.js"
import jobsRoutes from "./routes/jobs.routes.js"
import orderItemsRoutes from "./routes/orderItems.routes.js"
import ordersRoutes from "./routes/orders.routes.js"
import storeRoutes from "./routes/store.routes.js"
import usersRoutes from "./routes/users.routes.js"

const server = express();

dotenv.config();

server.use(express.json());

server.use("/api/v1/items", itemsRoutes);
server.use("/api/v1/jobs", jobsRoutes);
server.use("/api/v1/orderItems", orderItemsRoutes);
server.use("/api/v1/orders", ordersRoutes);
server.use("/api/v1/store", storeRoutes);
server.use("/api/v1/users", usersRoutes);

server.use(errorHandler);

const PORT = process.env.PORT || 3001;

connectDB().then(()=>{
  server.listen(PORT, ()=>{
    console.log(`Server listening on PORT:${PORT}`);
  })
})