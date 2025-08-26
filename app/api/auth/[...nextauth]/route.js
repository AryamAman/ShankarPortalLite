import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Read the comma-separated admin emails from your .env.local file
const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];

// --- NEW: Read the comma-separated allowed student emails ---
const allowedEmails = process.env.ALLOWED_EMAILS ? process.env.ALLOWED_EMAILS.split(',') : [];
// Create a Set for very fast email lookups (more efficient than an array)
const allowedEmailsSet = new Set(allowedEmails);


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Set the session strategy to JSON Web Tokens
  session: {
    strategy: 'jwt',
  },

  // Use the dedicated JWT secret for signing tokens
  secret: process.env.JWT_SECRET,

  callbacks: {
    // This callback assigns the 'admin' role to the token if the user is an admin
    async jwt({ token, user }) {
      if (user) {
        const isAdmin = adminEmails.includes(user.email);
        if (isAdmin) {
          token.role = 'admin'; // Add the admin role to the token
        }
      }
      return token;
    },

    // This callback passes the 'role' from the token to the client-side session
    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },

    // --- UPDATED: This callback now checks against your specific email list ---
    async signIn({ user, account, profile }) {
      // Allow sign-in ONLY if the user's email is in the allowed list
      if (profile.email && allowedEmailsSet.has(profile.email)) {
        return true; // Allow sign-in
      } else {
        return '/unauthorized'; // Redirect if email is not on the list
      }
    },
  },

  pages: {
    error: '/unauthorized',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };