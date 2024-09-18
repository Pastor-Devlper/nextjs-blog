import { ObjectId, MongoClient } from 'mongodb';

const mongodbUrl = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster0.ehe1nta.mongodb.net/?retryWrites=true&w=majority`;

export async function connectDatabase() {
  const client = new MongoClient(
    `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster0.ehe1nta.mongodb.net/?retryWrites=true&w=majority`
  );
  await client.connect();
  console.log('Connected successfully to server');
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db('events');
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function getPostData(postId) {
  const client = new MongoClient(mongodbUrl);
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db('my-site');
  const post = await db
    .collection('posts')
    .findOne({ _id: new ObjectId(postId) });
  if (!post) console.log('No such post!');
  // console.log(post);
  const postData = {
    postId: post._id.toString(),
    content: post.content,
    ...post.data,
  };
  return postData;
}

export async function getAllPosts() {
  const client = new MongoClient(mongodbUrl);
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db('my-site');
  const posts = await db.collection('posts').find().sort({ _id: -1 }).toArray();
  // console.log(posts);
  const postsData = posts.map((post) => {
    return {
      postId: post._id.toString(),
      content: post.content,
      ...post.data,
    };
  });
  // console.log(postsData);
  return postsData;
}

export async function getFeaturedPosts() {
  const client = new MongoClient(mongodbUrl);
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db('my-site');
  const posts = await db
    .collection('posts')
    .find({ 'data.isFeatured': 'true' })
    .sort({ _id: -1 })
    .toArray();
  // console.log(posts);
  const postsData = posts.map((post) => {
    return {
      postId: post._id.toString(),
      content: post.content,
      ...post.data,
    };
  });
  // console.log(postsData);
  return postsData;
}
