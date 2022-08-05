const { DB_URL="mongodb+srv://elinkdev:Elinkdev1234@cluster0.yowuhzs.mongodb.net", DB_NAME="elinkdev" }  = process.env;


export default {
    development: {
        MONGO_URI: `${DB_URL}/${DB_NAME}`
    },
    staging: {
        MONGO_URI: `${DB_URL}/${DB_NAME}`
    },
    production: {
        MONGO_URI: `${DB_URL}/${DB_NAME}`
    }
}
