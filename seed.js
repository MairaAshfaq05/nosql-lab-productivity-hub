require('dotenv').config();
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = process.env.DB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

async function connect() {
  await client.connect();
  console.log('✓ Connected to MongoDB');
  return client.db('projectdb'); // DB name
}

(async () => {
  const db = await connect();

  // ── CLEAR OLD DATA ───────────────────────────────────────
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  // ── UNIQUE INDEX ─────────────────────────────────────────
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  // ── USERS ────────────────────────────────────────────────
  const hash1 = await bcrypt.hash('meow123', 10);
  const hash2 = await bcrypt.hash('maira123', 10);

  const u1 = await db.collection('users').insertOne({
    email: 'meow@example.com',
    passwordHash: hash1,
    name: 'meow',
    createdAt: new Date()
  });

  const u2 = await db.collection('users').insertOne({
    email: 'maira@example.com',
    passwordHash: hash2,
    name: 'maira',
    createdAt: new Date()
  });

  const aliceId = u1.insertedId;
  const bobId   = u2.insertedId;

  // ── PROJECTS ─────────────────────────────────────────────
  const p1 = await db.collection('projects').insertOne({
    ownerId: aliceId,
    name: 'Final Year Project',
    description: 'My thesis project.',
    archived: false,
    createdAt: new Date('2024-01-10')
  });

  const p2 = await db.collection('projects').insertOne({
    ownerId: aliceId,
    name: 'Personal Website',
    description: 'Portfolio redesign.',
    archived: false,
    createdAt: new Date('2024-02-15')
  });

  const p3 = await db.collection('projects').insertOne({
    ownerId: bobId,
    name: 'Mobile App',
    description: 'Budget tracking app.',
    archived: false,
    createdAt: new Date('2024-03-01')
  });

  const p4 = await db.collection('projects').insertOne({
    ownerId: bobId,
    name: 'Old Blog',
    description: 'Archived blog.',
    archived: false,
    createdAt: new Date('2023-11-20')
  });

  const fyp  = p1.insertedId;
  const web  = p2.insertedId;
  const app  = p3.insertedId;
  const blog = p4.insertedId;

  // ── TASKS ────────────────────────────────────────────────
  await db.collection('tasks').insertOne({
    ownerId: aliceId,
    projectId: fyp,
    title: 'Write literature review',
    status: 'in-progress',
    priority: 3,
    tags: ['writing', 'research'],
    subtasks: [
      { title: 'Collect papers', done: true },
      { title: 'Write review', done: false }
    ],
    dueDate: new Date('2024-04-30'),
    createdAt: new Date('2024-01-12')
  });

  await db.collection('tasks').insertOne({
    ownerId: aliceId,
    projectId: fyp,
    title: 'Setup dev environment',
    status: 'done',
    priority: 2,
    tags: ['setup'],
    subtasks: [
      { title: 'Install Node', done: true },
      { title: 'Install MongoDB', done: true }
    ],
    createdAt: new Date('2024-01-11')
  });

  await db.collection('tasks').insertOne({
    ownerId: aliceId,
    projectId: web,
    title: 'Design homepage',
    status: 'todo',
    priority: 2,
    tags: ['design', 'frontend'],
    subtasks: [
      { title: 'Sketch wireframe', done: false }
    ],
    dueDate: new Date('2024-05-15'),
    createdAt: new Date('2024-02-20')
  });

  await db.collection('tasks').insertOne({
    ownerId: bobId,
    projectId: app,
    title: 'Implement login screen',
    status: 'in-progress',
    priority: 3,
    tags: ['android', 'auth'],
    subtasks: [
      { title: 'Design UI', done: true },
      { title: 'Connect to backend', done: false }
    ],
    createdAt: new Date('2024-03-05')
  });

  await db.collection('tasks').insertOne({
    ownerId: bobId,
    projectId: blog,
    title: 'Export posts to markdown',
    status: 'todo',
    priority: 1,
    tags: ['content'],
    subtasks: [
      { title: 'Write export script', done: false }
    ],
    createdAt: new Date('2023-12-01')
  });

  // ── NOTES ────────────────────────────────────────────────
  await db.collection('notes').insertOne({
    ownerId: aliceId,
    projectId: fyp,
    title: 'Supervisor meeting',
    body: 'Discussed methodology chapter.',
    tags: ['meeting', 'supervisor'],
    createdAt: new Date('2024-01-18')
  });

  await db.collection('notes').insertOne({
    ownerId: aliceId,
    projectId: web,
    title: 'Design inspiration',
    body: 'Links to portfolios I like.',
    tags: ['design', 'inspiration'],
    createdAt: new Date('2024-02-22')
  });

  await db.collection('notes').insertOne({
    ownerId: aliceId,
    title: 'Books to read',
    body: 'Clean Code, The Pragmatic Programmer.',
    tags: ['personal', 'reading'],
    createdAt: new Date('2024-01-05')
  });

  await db.collection('notes').insertOne({
    ownerId: bobId,
    projectId: app,
    title: 'API endpoints',
    body: 'POST /auth/login, GET /budget/summary',
    tags: ['api', 'planning'],
    createdAt: new Date('2024-03-03')
  });

  await db.collection('notes').insertOne({
    ownerId: bobId,
    title: 'Standup template',
    body: 'Yesterday / Today / Blockers',
    tags: ['meeting', 'template'],
    createdAt: new Date('2024-03-10')
  });

  console.log('✓ Seed complete!');
  console.log('meow@example.com / meow123');
  console.log('maira@example.com / maira123');

  process.exit(0);
})();