
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GooglePayload {
  email: string;
  name: string;
  sub: string;
}

export default ({ strapi }: { strapi: any }) => ({
  async googleOrLink(ctx) {
    const { access_token, id_token, email } = ctx.request.body as {
      access_token: string;
      id_token: string;
      email: string;
    };

    try {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload() as GooglePayload;
      const googleEmail = payload.email;

      if (email !== googleEmail) {
        return ctx.badRequest("Email mismatch");
      }

      // Check if user exists
      let user = await strapi.query("plugin::users-permissions.user").findOne({
        where: { email: googleEmail },
      });

      if (user) {
        console.log("🚀 ~ googleOrLink ~ user:", user);
        // User exists, update Google ID if not set
        if (!user.googleId) {
          user = await strapi.query("plugin::users-permissions.user").update({
            where: { id: user.id },
            data: { googleId: payload.sub },
          });
        }
      } else {
        // Create new user
        user = await strapi.query("plugin::users-permissions.user").create({
          data: {
            username: `${googleEmail.split("@")[0]}_${Date.now().toString().slice(-4)}`,
            email: googleEmail,
            googleId: payload.sub,
            provider: "google",
            confirmed: true,
          },
        });
      }

      // Generate JWT token
      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      });

      return { user, jwt };
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Invalid token");
    }
  },
});
