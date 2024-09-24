export default {
  Base: "/api",
  Health: "/health",
  Admin: { Base: "/admin" },
  MetaData: {
    Base: "/metadata",
    AddAllMetaData: "/addAll",
    AddMetaData: "/add",
    GetMetadata: "/getMetadata",
  },
  Auth: {
    Base: "/auth",
    CheckUser: "/inquireUser",
    CreateUser: "/registerUser",
    DeletedUser: "/deleteUser",
    Login: "/login",
    Logout: "/logout",
  },
  Users: {
    Base: "/users",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
  Bets: {
    placeBet: "/placebet",
    getAllBets: "/allbets",
    getBet: "/bet",
  },
} as const;
