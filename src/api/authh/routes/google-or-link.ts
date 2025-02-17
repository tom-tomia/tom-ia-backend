export default {
    routes: [
      {
        method: "POST",
        path: "/authh/google-or-link",
        handler: "google-or-link.googleOrLink",
        config: {
          auth: false,
        },
      },
    ],
  };
  