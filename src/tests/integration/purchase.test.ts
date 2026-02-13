import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PurchaseController } from '@/controllers/purchase.controller';
import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth/utils';

// Mocks
const mockCreatePurchase = vi.fn();
const mockGetAllPurchases = vi.fn();

vi.mock('@/services/purchase.service', () => {
  return {
    PurchaseService: class {
      createPurchase = mockCreatePurchase;
      getAllPurchases = mockGetAllPurchases;
    },
  };
});

vi.mock('@/lib/auth/utils', () => ({
  getAuthSession: vi.fn(),
}));

describe('PurchaseController Integration Tests', () => {
  let controller: PurchaseController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new PurchaseController();
  });

  it('should create a purchase successfully', async () => {
    // Mock Session
    (getAuthSession as any).mockResolvedValue({ user: { email: 'test@example.com' } });

    // Mock Service Response
    const mockPurchase = {
      id: 'purchase-123',
      itemId: 'item-123',
      githubLogin: 'octocat',
      createdAt: new Date(),
    };
    mockCreatePurchase.mockResolvedValue(mockPurchase);

    // Mock Request
    const req = new NextRequest('http://localhost/api/purchases', {
      method: 'POST',
      body: JSON.stringify({ itemId: 'item-123' }),
    });

    const res = await controller.create(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.id).toBe('purchase-123');
    expect(mockCreatePurchase).toHaveBeenCalledWith({ itemId: 'item-123' });
  });

  it('should return 409 if item is out of stock', async () => {
    (getAuthSession as any).mockResolvedValue({ user: { email: 'test@example.com' } });
    
    mockCreatePurchase.mockRejectedValue(new Error('Item out of stock'));

    const req = new NextRequest('http://localhost/api/purchases', {
      method: 'POST',
      body: JSON.stringify({ itemId: 'item-123' }),
    });

    const res = await controller.create(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.error).toBe('Item out of stock');
  });

  it('should return 401 if unauthorized', async () => {
    (getAuthSession as any).mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/purchases', {
      method: 'POST',
      body: JSON.stringify({ itemId: 'item-123' }),
    });

    const res = await controller.create(req);
    
    expect(res.status).toBe(401);
  });

  it('should return 404 if item is not found', async () => {
    (getAuthSession as any).mockResolvedValue({ user: { email: 'test@example.com', id: 'u1' } });
    mockCreatePurchase.mockRejectedValue(new Error('Item not found'));

    const req = new NextRequest('http://localhost/api/purchases', {
      method: 'POST',
      body: JSON.stringify({ itemId: 'item-123' }),
    });

    const res = await controller.create(req);
    expect(res.status).toBe(404);
  });

  it('should return 500 on unexpected error', async () => {
    (getAuthSession as any).mockResolvedValue({ user: { email: 'test@example.com', id: 'u1' } });
    mockCreatePurchase.mockRejectedValue(new Error('Boom'));

    const req = new NextRequest('http://localhost/api/purchases', {
      method: 'POST',
      body: JSON.stringify({ itemId: 'item-123' }),
    });

    const res = await controller.create(req);
    expect(res.status).toBe(500);
  });
});
