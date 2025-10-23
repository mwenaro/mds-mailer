/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
// Provide lightweight mocks for next/server so module imports don't depend on Node globals
jest.mock('next/server', () => {
  class MockRequest {
    private _body: string | undefined;
    constructor(_url: string, init?: any) {
      this._body = init?.body;
    }
    async json() {
      return this._body ? JSON.parse(this._body) : {};
    }
  }

  const NextResponse = {
    json: (payload: any, opts?: any) => ({ json: async () => payload, status: opts?.status ?? 200 })
  };

  return { NextResponse, Request: MockRequest };
});

jest.mock('../lib/store');
jest.mock('../lib/auth');

// require mocked modules at runtime (avoid loading real MongoDB client during test discovery)
const store = require('../lib/store');
const auth = require('../lib/auth');
// acquire the mocked Request class at runtime from next/server
const { Request: MockRequest } = require('next/server');

describe('mailboxes API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('GET returns 401 when unauthenticated', async () => {
    jest.spyOn(auth, 'getServerAuthSession').mockResolvedValue(null as unknown as null);
    let GET: any;
    jest.isolateModules(() => {
      GET = require('../app/api/mailboxes/route').GET;
    });
    const res = await GET();
    const json = await res.json();
    expect(json).toHaveProperty('error', 'unauthenticated');
  });

  it('POST returns 401 when unauthenticated', async () => {
    jest.spyOn(auth, 'getServerAuthSession').mockResolvedValue(null as unknown as null);
    const req = new MockRequest('http://localhost', { method: 'POST', body: JSON.stringify({ email: 'a@b.com', password: 'x' }) });
    let POST: any;
    jest.isolateModules(() => {
      POST = require('../app/api/mailboxes/route').POST;
    });
    const res = await POST(req as any);
    const json = await res.json();
    expect(json).toHaveProperty('error', 'unauthenticated');
  });

  it('POST creates mailbox for authenticated user', async () => {
    jest.spyOn(auth, 'getServerAuthSession').mockResolvedValue({ userId: 'user-1', sessionId: 's1', orgId: null, claims: null } as unknown as ReturnType<typeof auth.getServerAuthSession>);
    const spy = jest.spyOn(store, 'addMailbox').mockResolvedValue({ id: 'm1', email: 'a@b.com' } as unknown as ReturnType<typeof store.addMailbox>);
    const req = new MockRequest('http://localhost', { method: 'POST', body: JSON.stringify({ email: 'a@b.com', password: 'x' }) });
    let POST: any;
    jest.isolateModules(() => {
      POST = require('../app/api/mailboxes/route').POST;
    });
    const res = await POST(req as any);
    const json = await res.json();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ ownerId: 'user-1' }));
    expect(json).toHaveProperty('id', 'm1');
  });
});
