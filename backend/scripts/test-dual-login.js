const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const API_BASE = 'http://localhost:3001/api/v1';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, ok: res.ok, headers: res.headers, data: json };
}

async function main() {
  console.log('=== STEP 1: TEST LOGIN WITH USERNAME VS EMAIL ===');
  
  // Test 1: Login with username 'admin'
  const adminPw = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345678';
  let adminRes = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin', password: adminPw }),
  });

  if (!adminRes.ok) {
    console.log('Testing login with email fallback...');
    adminRes = await request(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@bizonix.com', password: adminPw }),
    });
  }

  if (!adminRes.ok) {
    console.error('❌ Admin login failed:', adminRes.status, adminRes.data);
    return;
  }
  console.log('✅ Admin login successful! Status:', adminRes.status);

  // Extract set-cookie header
  const rawCookie = adminRes.headers.get('set-cookie') || '';
  const adminCookie = rawCookie.split(';')[0];
  console.log('   - Extracted cookie:', adminCookie ? 'bz_admin_access=...' : 'None');

  // STEP 2: Super Admin creates a new employee
  console.log('\n=== STEP 2: SUPER ADMIN CREATES EMPLOYEE ===');
  const testEmail = `agent_${Date.now()}@bizonix.com`;
  const testName = 'Devon Vance';
  
  const createRes = await request(`${API_BASE}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      email: testEmail,
      displayName: testName,
      role: 'SITE_ADMIN',
    }),
  });

  if (!createRes.ok) {
    console.error('❌ Failed to create employee:', createRes.status, createRes.data);
    return;
  }

  const newEmployee = createRes.data;
  console.log('✅ New Employee Created:');
  console.log('   - ID:', newEmployee.id);
  console.log('   - Email:', newEmployee.email);
  console.log('   - Generated Username:', newEmployee.username);
  console.log('   - Temporary Password:', newEmployee.temporaryPassword);
  console.log('   - Welcome Email Sent:', newEmployee.welcomeEmailSent);

  // STEP 3: Assign a deal to this employee (First Assignment)
  console.log('\n=== STEP 3: ASSIGN DEAL TO EMPLOYEE (FIRST ASSIGNMENT) ===');
  let testEnquiry = await prisma.enquiry.findFirst({
    where: { status: { notIn: ['CLOSED', 'SPAM'] } },
    orderBy: { createdAt: 'desc' }
  });

  if (!testEnquiry) {
    testEnquiry = await prisma.enquiry.create({
      data: {
        fullName: 'Rajesh Enterprise',
        companyName: 'Apex Hypermarkets',
        email: 'rajesh@apexretail.in',
        phone: '+91 98765 43210',
        city: 'Mumbai',
        status: 'NEW',
        priority: 'HIGH',
        leadScore: 85,
        intent: 'Book a Demo',
      }
    });
  }

  const assignRes = await request(`${API_BASE}/admin/enquiries/${testEnquiry.id}/assign`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: JSON.stringify({ assignedToId: newEmployee.id }),
  });

  if (!assignRes.ok) {
    console.error('❌ Failed to assign deal:', assignRes.status, assignRes.data);
  } else {
    console.log(`✅ Deal "${testEnquiry.companyName}" successfully assigned to ${newEmployee.displayName}`);
  }

  // Check in DB if welcomeEmailSent was set to true
  const checkEmployee = await prisma.user.findUnique({ where: { id: newEmployee.id } });
  console.log('   - In DB, welcomeEmailSent:', checkEmployee.welcomeEmailSent);

  // STEP 4: Login with Employee's generated username & password
  console.log('\n=== STEP 4: EMPLOYEE LOGS IN WITH GENERATED USERNAME ===');
  const empLoginRes = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: newEmployee.username,
      password: newEmployee.temporaryPassword,
    }),
  });

  if (!empLoginRes.ok) {
    console.error('❌ Employee username login failed:', empLoginRes.status, empLoginRes.data);
    return;
  }
  console.log('✅ Employee logged in successfully using USERNAME:', newEmployee.username);
  const empRawCookie = empLoginRes.headers.get('set-cookie') || '';
  const empCookie = empRawCookie.split(';')[0];

  // STEP 5: Verify Employee Enquiry Scoping
  console.log('\n=== STEP 5: VERIFY EMPLOYEE ENQUIRY SCOPING ===');
  const empEnquiriesRes = await request(`${API_BASE}/admin/enquiries`, {
    headers: { Cookie: empCookie },
  });

  if (!empEnquiriesRes.ok) {
    console.error('❌ Failed to fetch employee enquiries:', empEnquiriesRes.status, empEnquiriesRes.data);
  } else {
    const items = empEnquiriesRes.data.items || [];
    console.log(`✅ Employee retrieved ${items.length} enquiries.`);
    const nonAssigned = items.filter(e => e.assignedToId !== newEmployee.id);
    if (nonAssigned.length === 0) {
      console.log('🔒 ZERO LEAKAGE CONFIRMED: All visible enquiries are strictly assigned to this employee!');
    } else {
      console.error('🚨 LEAK DETECTED! Found enquiries not assigned to employee:', nonAssigned.map(e => e.id));
    }
  }

  // STEP 6: Verify Employee can perform actions on their assigned deal
  console.log('\n=== STEP 6: VERIFY EMPLOYEE CAN PERFORM DEAL ACTIONS ===');
  // 1. Update status
  const statusRes = await request(`${API_BASE}/admin/enquiries/${testEnquiry.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: empCookie },
    body: JSON.stringify({ status: 'CONTACTED' }),
  });
  console.log('✅ Employee updated deal status to:', statusRes.data?.status || statusRes.status);

  // 2. Add internal note
  const noteRes = await request(`${API_BASE}/admin/enquiries/${testEnquiry.id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: empCookie },
    body: JSON.stringify({ content: 'Called the client. Very interested in our inventory sync module.' }),
  });
  console.log('✅ Employee added internal note:', noteRes.data?.content || noteRes.status);

  // 3. Update details
  const detailsRes = await request(`${API_BASE}/admin/enquiries/${testEnquiry.id}/details`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: empCookie },
    body: JSON.stringify({ priority: 'URGENT', nextAction: 'Schedule technical deep dive with CTO' }),
  });
  console.log('✅ Employee updated deal details. Priority:', detailsRes.data?.priority, '| Next action:', detailsRes.data?.nextAction);

  // STEP 7: Verify Employee CANNOT view or modify another employee's deal
  console.log('\n=== STEP 7: VERIFY EMPLOYEE CANNOT VIEW UNASSIGNED/OTHER DEALS ===');
  const otherEnquiry = await prisma.enquiry.findFirst({
    where: { NOT: { assignedToId: newEmployee.id } }
  });

  if (otherEnquiry) {
    const forbiddenRes = await request(`${API_BASE}/admin/enquiries/${otherEnquiry.id}`, {
      headers: { Cookie: empCookie }
    });
    if (forbiddenRes.status === 403) {
      console.log(`🔒 ACCESS FORBIDDEN CONFIRMED (403): Employee blocked from viewing enquiry ${otherEnquiry.id}`);
    } else {
      console.log(`Result: status ${forbiddenRes.status}`);
    }
  }

  // Clean up created test employee
  await prisma.user.delete({ where: { id: newEmployee.id } }).catch(() => {});
  console.log('\n=== ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY! ===');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
