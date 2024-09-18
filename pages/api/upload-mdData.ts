import { ObjectId } from 'mongodb';
import { connectDatabase } from '../../lib/db-util';
import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

interface PostData {
  title: string;
  date: string;
  excerpt: string;
  thumbnail: string;
  isFeatured: boolean;
}

interface NewPost {
  content: string;
  data: PostData;
}

interface UpdatedPost {
  postId: string;
  content: string;
  data: PostData;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content, data }: { content: string; data: PostData } = req.body;

    if (!content || !data.title || !data.date) {
      res.status(422).json({ message: 'Invalid input.' });
      return;
    }

    // Store it in a database
    const newPost: NewPost = {
      content,
      data,
    };

    let client: MongoClient;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Could not connect to database' });
      return;
    }

    const db = client.db(process.env.mongodb_database);

    try {
      const result = await db.collection('posts').insertOne(newPost);
      console.log('Inserted post =>', result);
    } catch (error) {
      client.close();
      res.status(500).json({ message: 'Storing post failed!' });
    }

    client.close();

    res.status(201).json({ message: 'Successfully stored post!', newPost });
  }

  if (req.method === 'PATCH') {
    const {
      postId,
      content,
      data,
    }: { postId: string; content: string; data: PostData } = req.body;

    if (!content || !data) {
      res.status(422).json({ message: 'Invalid input.' });
      return;
    }

    // Store it in a database
    const updatedPost: UpdatedPost = {
      postId,
      content,
      data,
    };

    let client: MongoClient;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Could not connect to database' });
      return;
    }

    const db = client.db(process.env.mongodb_database);

    const filter = { _id: new ObjectId(postId) };
    const options = { upsert: false };
    const updateDoc = { $set: { content, data } };

    try {
      const result = await db
        .collection('posts')
        .updateOne(filter, updateDoc, options);
      console.log('Updated post =>', result);
    } catch (error) {
      client.close();
      res.status(500).json({ message: 'Updating post failed!' });
    }

    client.close();

    res
      .status(201)
      .json({ message: 'Successfully updated post!', updatedPost });
  }

  if (req.method === 'DELETE') {
    const { postId }: { postId: string } = req.body;

    if (!postId) {
      res.status(422).json({ message: 'Invalid ID' });
      return;
    }

    let client: MongoClient;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Could not connect to database' });
      return;
    }

    const db = client.db(process.env.mongodb_database);

    const filter = { _id: new ObjectId(postId) };

    try {
      const result = await db.collection('posts').deleteOne(filter);
      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
      } else {
        console.log('No documents matched the query. Deleted 0 documents.');
      }
    } catch (error) {
      client.close();
      res.status(500).json({ message: 'Deleting post failed!' });
    }

    client.close();

    res.status(201).json({ message: 'Successfully deleted post!' });
  }
}

export default handler;
