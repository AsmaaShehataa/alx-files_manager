import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';

const {ObjectId} = require('mongodb');


class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }

    const userExist = await dbClient.db.collection('users').findOne({ email });
    if (userExist) {
      return res.status(400).send({ error: 'Already exist' });
    }
    const hashedPassword = sha1(password);
    const nuser = {
      email: email,
      password: hashedPassword,
    };
    static async getMe (request, response) {
      const token = request.header('X-Token') || null;
      if (!token) return response.status(401).send({ error: 'Unauthorized' });
  
      const redisToken = await RedisClient.get(`auth_${token}`);
      if (!redisToken) return response.status(401).send({ error: 'Unauthorized' });
  
      const user = await DBClient.db.collection('users').findOne({ _id: ObjectId(redisToken) });
      if (!user) return response.status(401).send({ error: 'Unauthorized' });

    try {
      const result = await dbClient.db.collection('users').insertOne(nuser);
      const { _id } = result.ops[0];
      return res.status(200).json({ id: _id, email: email });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
