const request = require('supertest');
const app = require('../server');

describe('TaskFlow API Tests', () => {
  let token;
  let projectId;
  let userId;

  // Test de registro
  test('Should register a new user', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(uniqueEmail);
    
    token = res.body.token;
    userId = res.body.user.id;
  });

  // Test de login
  test('Should login existing user', async () => {
    // Primero registrar un usuario
    const testEmail = `login${Date.now()}@example.com`;
    await request(app)
      .post('/api/register')
      .send({
        name: 'Login User',
        email: testEmail,
        password: 'password123'
      });

    // Luego hacer login
    const res = await request(app)
      .post('/api/login')
      .send({
        email: testEmail,
        password: 'password123'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  // Test crear proyecto
  test('Should create a project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'Test Description'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Project');
    expect(res.body.id).toBeDefined();
    
    projectId = res.body.id;
  });

  // Test obtener proyectos
  test('Should get user projects', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test crear tarea
  test('Should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        projectId: projectId,
        assignedTo: userId,
        priority: 'high'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Task');
    expect(res.body.status).toBe('pending');
  });

  // Test obtener tareas
  test('Should get project tasks', async () => {
    const res = await request(app)
      .get(`/api/tasks/${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test dashboard
  test('Should get dashboard stats', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.total).toBeDefined();
    expect(res.body.pending).toBeDefined();
    expect(res.body.inProgress).toBeDefined();
    expect(res.body.completed).toBeDefined();
  });

  // Test sin autenticación
  test('Should reject requests without token', async () => {
    const res = await request(app)
      .get('/api/projects');
    
    expect(res.status).toBe(401);
  });
});
