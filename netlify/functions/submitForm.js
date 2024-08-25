const { MongoClient } = require('mongodb');

// Replace this with your MongoDB connection string
const uri = 'mongodb+srv://mnsoqar1:Soqar4ever101Mongo@cluster0.kaufvjp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const data = JSON.parse(event.body);

    try {
      await client.connect();
      const database = client.db('form-data');
      const collection = database.collection('submissions');

      await collection.insertOne(data);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data stored successfully!' }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to store data' }),
      };
    } finally {
      await client.close();
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
};
