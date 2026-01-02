#!/usr/bin/env node
const mongoose = require('mongoose');

async function run() {
  const uri = process.env.MONGO_URL || process.argv[2];
  if (!uri) {
    console.error('Missing MongoDB URI. Provide MONGO_URL env or pass it as first argument.');
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: process.env.MONGO_DBNAME });
  const db = mongoose.connection.db;
  const notes = db.collection('notes');
  const folders = db.collection('folders');

  console.log('Connected. Removing tagIds from notes (if any)...');
  const r1 = await notes.updateMany({ tagIds: { $exists: true } }, { $unset: { tagIds: "" } });
  console.log(`tagIds removed from ${r1.modifiedCount} documents.`);

  console.log('Ensuring default folder exists (title: Unsorted)...');
  let defaultFolder = await folders.findOne({ title: 'Unsorted' });
  if (!defaultFolder) {
    const now = new Date();
    const insert = await folders.insertOne({ title: 'Unsorted', createdAt: now, updatedAt: now });
    defaultFolder = { _id: insert.insertedId, title: 'Unsorted' };
    console.log('Created default folder with id', insert.insertedId.toString());
  } else {
    console.log('Found existing default folder id', defaultFolder._id.toString());
  }

  const missingFolderFilter = { $or: [ { folderId: { $exists: false } }, { folderId: null } ] };
  console.log('Assigning default folder to notes missing folderId...');
  const r2 = await notes.updateMany(missingFolderFilter, { $set: { folderId: defaultFolder._id } });
  console.log(`Assigned folderId to ${r2.modifiedCount} notes.`);

  console.log('Done. Closing connection.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
