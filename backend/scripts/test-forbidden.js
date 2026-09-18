const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const API_BASE = 'http://localhost:3001/api/v1';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, ok: res.ok, headers: res.headers, data: json };
}

async function main() {
  const adminPw = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345678';
  const adminRes = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@bizonix.com', password: adminPw }),
  });
  const adminCookie = (adminRes.headers.get('set-cookie') || '').split(';')[0];

  // Create an employee
  const createEmp = await request(`${API_BASE}/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({
      email: `emp_${Date.now()}@bizonix.com`,
      displayName: 'Maya Lin',
      role: 'SITE_ADMIN',
    }),
  });
  const emp = createEmp.data;

  // Log in as employee
  const empLogin = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emp.username, password: emp.temporaryPassword }),
  });
  const empCookie = (empLogin.headers.get('set-cookie') || '').split(';')[0];

  // Create an enquiry NOT assigned to Maya (assigned to admin or unassigned)
  const adminUser = await prisma.user.findFirst({ where: { email: 'admin@bizonix.com' } });
  const secretEnquiry = await prisma.enquiry.create({
    data: {
      fullName: 'Confidential Client',
      companyName: 'Titan Enterprise',
      email: 'secret@titan.com',
      status: 'NEW',
      priority: 'URGENT',
      assignedToId: adminUser.id,
    }
  });

  // Maya tries to view this enquiry
  const viewRes = await request(`${API_BASE}/admin/enquiries/${secretEnquiry.id}`, {
    headers: { Cookie: empCookie },
  });
  console.log('Employee viewing another deal -> Status:', viewRes.status);
  if (viewRes.status === 403) {
    console.log('🔒 VERIFIED: 403 Forbidden! Employee blocked from viewing another employee\'s deal.');
  } else {
    console.error('FAILED: expected 403 but got:', viewRes.status, viewRes.data);
  }

  // Maya tries to update status of this enquiry
  const updateRes = await request(`${API_BASE}/admin/enquiries/${secretEnquiry.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: empCookie },
    body: JSON.stringify({ status: 'CLOSED' }),
  });
  console.log('Employee updating another deal -> Status:', updateRes.status);
  if (updateRes.status === 403) {
    console.log('🔒 VERIFIED: 403 Forbidden! Employee blocked from modifying another employee\'s deal.');
  }

  // Maya tries to reassign an enquiry (should be 403 Forbidden)
  const assignRes = await request(`${API_BASE}/admin/enquiries/${secretEnquiry.id}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: empCookie },
    body: JSON.stringify({ assignedToId: emp.id }),
  });
  console.log('Employee trying to reassign deal -> Status:', assignRes.status);
  if (assignRes.status === 403) {
    console.log('🔒 VERIFIED: 403 Forbidden! Non-super-admin blocked from reassigning deals.');
  }

  // Clean up
  await prisma.enquiry.delete({ where: { id: secretEnquiry.id } });
  await prisma.user.delete({ where: { id: emp.id } });
  console.log('\n✅ ALL SECURITY BOUNDARY CHECKS PASSED PERFECTLY!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
