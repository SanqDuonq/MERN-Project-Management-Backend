import mongoose from "mongoose"
import appConfig from "../config/app.config"

const connectMongoDB = async () => {
    try {
        const connect = await mongoose.connect(appConfig.MONGO_URI!);
        console.log(`Connected mongoDB successful ${connect.connection.host}`)
    } catch (error) {
        console.log(`Connected mongoDB failed ${error}`)
        process.exit(1);
    }
}

export default connectMongoDB;

