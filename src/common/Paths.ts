import DeletedUser from "@src/models/DeletedUserData";

export default {
  Base: "/api",
  Health: "/health",
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
