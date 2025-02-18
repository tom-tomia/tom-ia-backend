export default {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    await strapi
      .plugin("users-permissions")
      .service("providers-registry")
      .add("google", {
        enabled: true,
        icon: "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Google-512.png",
        key: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        callback: `${strapi.config.server.url}/api/connect/google/callback`,
        scope: ["email", "profile"],
        oauth: 2,
        authorize_url: "https://accounts.google.com/o/oauth2/v2/auth",
        access_url: "https://oauth2.googleapis.com/token",
        async authCallback({ accessToken, providers, purest }) {
          const google = purest({ provider: "google" });

          const res = await google
            .get("https://www.googleapis.com/oauth2/v3/userinfo")
            .auth(accessToken)
            .request();

          console.log("This is the response", res);

          const { body } = res;

          return {
            email: body.email,
            firstname: body.given_name,
            lastname: body.family_name,
            provider: "google",
            username: body.email.split("@")[0],
          };
        },
      });
  },
};