import mongoose from 'mongoose';
import 'dotenv/config';

const mongoConnect = () => {
    mongoose.connect('mongodb+srv://symplicenunu:simplice@cluster0.3adxjcm.mongodb.net/tm?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    mongoose.connection
        .once('open', () => console.log('Database connected successful'))
        .on('error', (err) => console.log(err));
}

export default mongoConnect;
