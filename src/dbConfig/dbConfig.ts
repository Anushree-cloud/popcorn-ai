import mongoose from 'mongoose';

export async function connectDB () {
    try {
        mongoose.connect(process.env.MONGO_URL!) //MONGO_URL will definitely be received from env, "!" used.
        const connection = mongoose.connection
        connection.on('connected', () => {
            console.log("=========Mongo DB Connected=========")
        })
        connection.on('error', (err) => {
            console.log("=========Mongo DB is not connected=========", err)
            process.exit() //can use exit codes
        })
    } catch (err) {
        console.log("================Error while connecting DB!==============")
        console.log(err)
        console.log("========================================================")
    }
}