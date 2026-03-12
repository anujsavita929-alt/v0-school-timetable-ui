// Mock auth for development - replace with actual NextAuth setup
export const authOptions = {
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    },
  },
};

export const getServerSession = async () => {
  // Mock session for development - replace with actual NextAuth getServerSession
  return {
    user: {
      id: 'mock-user-id',
      email: 'principal@school.com',
      name: 'Principal User',
      role: 'principal',
      organizationId: 'mock-org-id'
    }
  };
};

// Type definitions for session
interface SessionUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  organizationId: string;
}

interface Session {
  user: SessionUser;
}

export type { Session, SessionUser };
