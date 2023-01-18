import { AuthService } from 'src/api/auth/auth.service';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthMiddleware(new AuthService())).toBeDefined();
  });
});
