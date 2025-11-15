import express from 'express';
import posts from './mock.js';

const app = express();
const PORT = 3000;

app.use(express.json());

//헬스 체크
app.get('/', (req, res) => {
  res.send('Prisma + PostgreSQL API');
});

// post 라우트
app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/posts', (req, res) => {
  console.log('posts');
  const title = req.body.title;
  const content = req.body.content;

  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    title,
    content,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// GET /posts/:id  (단건조회)
app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
});

// POST /posts  (생성)
app.post('/posts', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'title, content는 필수입니다.' });
  }

  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    title,
    content,
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

// PATCH /posts/:id  (부분수정)
app.patch('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const { title, content } = req.body;

  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;

  res.json(post);
});

// DELETE /posts/:id  (삭제)
app.delete('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  posts.splice(index, 1);
  // 삭제 후 내용 안 보내고 204로 응답
  res.status(204).send();
});

//서버 시작
app.listen(PORT, () => {
  console.log(`Server:http://localhost:${PORT}`);
});
