import mongoose from 'mongoose';
import config from './config';

const { NODE_ENV = 'development' } = process.env;

// eslint-disable-next-line import/prefer-default-export
export const db: mongoose.Connection = mongoose.createConnection(config[NODE_ENV].MONGO_URI);
//export const db: mongoose.Connection = mongoose.createConnection('mongodb+srv://elinkdev:Elinkdev1234@cluster0.yowuhzs.mongodb.net');
mongoose.set('debug', true);

// handlers
db.on('connecting', () => {
    console.log('\x1b[32m', 'MongoDB :: connecting');
});

db.on('error', (error) => {
    console.log('\x1b[31m', `MongoDB :: connection ${error}`);
    mongoose.disconnect();
});

db.on('connected', () => {
    console.log('\x1b[32m', 'MongoDB :: connected');
});

db.once('open', () => {
    console.log('\x1b[32m', 'MongoDB :: connection opened');
});

db.on('reconnected', () => {
    console.log('\x1b[33m"', 'MongoDB :: reconnected');
});

db.on('reconnectFailed', () => {
    console.log('\x1b[31m', 'MongoDB :: reconnectFailed');
});

db.on('disconnected', () => {
    console.log('\x1b[31m', 'MongoDB :: disconnected');
});

db.on('fullsetup', () => {
    console.log('\x1b[33m"', 'MongoDB :: reconnecting... %d');
});
