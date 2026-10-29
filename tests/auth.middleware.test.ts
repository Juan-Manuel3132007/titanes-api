import { before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

// Variables mínimas para que la configuración cargue sin un .env real
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'secreto-solo-para-pruebas';
process.env.JWT_EXPIRES_IN = '1h';
process.env.FRONTEND_URL ??= 'http://localhost:3000';

type Modulos = {
  autenticar: RequestHandler;
  soloAdmin: RequestHandler;
  firmar: (payload: { id: number; role: 'ADMIN' | 'USER' }) => string;
};

let m: Modulos;

before(async () => {
  // Se importan después de definir las variables de entorno
  const auth = await import('../src/interface/http/middlewares/auth');
  const { JwtTokenService } = await import('../src/infrastructure/security/JwtTokenService');
  const tokens = new JwtTokenService();
  m = { autenticar: auth.autenticar, soloAdmin: auth.soloAdmin, firmar: (p) => tokens.firmar(p) };
});

// Ejecuta un middleware y devuelve lo que recibió next()
function ejecutar(middleware: RequestHandler, req: Partial<Request>): unknown {
  let recibido: unknown = 'next-no-llamado';
  const next: NextFunction = (error?: unknown) => {
    recibido = error;
  };
  middleware(req as Request, {} as Response, next);
  return recibido;
}

function statusDe(resultado: unknown): number | undefined {
  return (resultado as { statusCode?: number } | undefined)?.statusCode;
}

describe('middleware autenticar', () => {
  it('responde 401 si no hay header Authorization', () => {
    const resultado = ejecutar(m.autenticar, { headers: {} });
    assert.equal(statusDe(resultado), 401);
  });

  it('responde 401 si el header no es Bearer', () => {
    const resultado = ejecutar(m.autenticar, { headers: { authorization: 'Basic abc' } });
    assert.equal(statusDe(resultado), 401);
  });

  it('responde 401 si el token es inválido', () => {
    const resultado = ejecutar(m.autenticar, { headers: { authorization: 'Bearer esto.no.sirve' } });
    assert.equal(statusDe(resultado), 401);
  });

  it('deja pasar y pone req.user con id y role si el token es válido', () => {
    const token = m.firmar({ id: 7, role: 'USER' });
    const req: Partial<Request> = { headers: { authorization: `Bearer ${token}` } };
    const resultado = ejecutar(m.autenticar, req);
    assert.equal(resultado, undefined);
    assert.deepEqual(req.user, { id: 7, role: 'USER' });
  });
});

describe('middleware soloAdmin', () => {
  it('responde 401 si no hay usuario autenticado', () => {
    assert.equal(statusDe(ejecutar(m.soloAdmin, {})), 401);
  });

  it('responde 403 si el usuario no es admin', () => {
    assert.equal(statusDe(ejecutar(m.soloAdmin, { user: { id: 2, role: 'USER' } })), 403);
  });

  it('deja pasar si el usuario es admin', () => {
    assert.equal(ejecutar(m.soloAdmin, { user: { id: 1, role: 'ADMIN' } }), undefined);
  });
});