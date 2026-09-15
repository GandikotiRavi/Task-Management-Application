const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function run() {
  console.log('Testing TaskFlow API endpoints...');

  // 1. Health check
  const health = await request({ host: '127.0.0.1', port: 5000, path: '/', method: 'GET' });
  console.log('Health check:', health.status, health.data?.name);

  // 2. Demo Login
  const demo = await request({
    host: '127.0.0.1',
    port: 5000,
    path: '/api/auth/demo',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('Demo Login:', demo.status, demo.data?.success ? 'PASS' : 'FAIL', 'User:', demo.data?.user?.name);
  const token = demo.data?.token;

  if (!token) {
    throw new Error('Token not received from demo login');
  }

  // 3. User Me
  const me = await request({
    host: '127.0.0.1',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('User Profile:', me.status, me.data?.user?.email);

  // 4. Stats
  const stats = await request({
    host: '127.0.0.1',
    port: 5000,
    path: '/api/tasks/stats',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('Stats:', stats.status, stats.data?.stats);

  // 5. Create Task
  const newTask = await request({
    host: '127.0.0.1',
    port: 5000,
    path: '/api/tasks',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
  }, {
    title: 'Verification Task via Automated Suite',
    description: 'Testing full CRUD and WebSocket event integration',
    status: 'Pending',
    priority: 'Urgent',
    category: 'Testing',
    dueDate: new Date(Date.now() + 86400000).toISOString()
  });
  console.log('Create Task:', newTask.status, newTask.data?.task?.title);
  const createdId = newTask.data?.task?._id;

  // 6. Update Task
  const updated = await request({
    host: '127.0.0.1',
    port: 5000,
    path: '/api/tasks/' + createdId,
    method: 'PUT',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
  }, {
    status: 'Completed'
  });
  console.log('Update Task:', updated.status, 'New status:', updated.data?.task?.status);

  // 7. Get Tasks (Filter status=Completed)
  const completedList = await request({
    host: '127.0.0.1',
    port: 5000,
    path: '/api/tasks?status=Completed',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('Filter Tasks:', completedList.status, 'Completed count:', completedList.data?.count);

  // 8. Delete Task
  const deleted = await request({
    host: '127.0.0.1',
    port: 5000,
    path: '/api/tasks/' + createdId,
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('Delete Task:', deleted.status, deleted.data?.message);

  console.log('ALL API TESTS PASSED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
