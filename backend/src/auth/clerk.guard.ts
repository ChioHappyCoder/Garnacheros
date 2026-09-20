import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verifyAuth } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const { claims } = await verifyAuth({
        headerToken: `Bearer ${token}`,
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      request.auth = {
        userId: claims?.sub,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
