import { describe, it, expect } from 'vitest';
import { POST } from '../route';

// Mock Next.js Request and NextResponse
const createRequest = (body: unknown, ip: string = '127.0.0.1') => {
  return new Request('http://localhost/api/simulate-insights', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
};

describe('/api/simulate-insights', () => {
  it('should return 400 for invalid payload', async () => {
    // Missing required fields
    const req = createRequest({ currentFootprint: -100 }); 
    const res = await POST(req);
    
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid request payload.');
  });

  it('should return fallback plan if GEMINI_API_KEY is missing but payload is valid', async () => {
    // Save original env
    const originalEnv = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const req = createRequest({
      currentFootprint: 5000,
      projectedFootprint: 4000,
      biggestImpactAction: "Switch to EV",
      selectedChanges: ["Reduce AC"]
    }, '127.0.0.2'); // different IP to avoid rate limit
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    
    expect(data.plan).toBeDefined();
    expect(data.plan.length).toBe(7);
    expect(data.plan[0].day).toBe(1);

    // Restore env
    process.env.GEMINI_API_KEY = originalEnv;
  });

  it('should rate limit after 5 requests', async () => {
    const ip = '192.168.1.1';
    const validBody = {
      currentFootprint: 5000,
      projectedFootprint: 4000,
      biggestImpactAction: "Switch to EV",
      selectedChanges: ["Reduce AC"]
    };

    // Make 5 successful requests
    for (let i = 0; i < 5; i++) {
      const req = createRequest(validBody, ip);
      const res = await POST(req);
      expect(res.status).not.toBe(429);
    }

    // 6th request should fail with 429
    const req6 = createRequest(validBody, ip);
    const res6 = await POST(req6);
    expect(res6.status).toBe(429);
    const data = await res6.json();
    expect(data.error).toContain('Rate limit exceeded');
  });
});
