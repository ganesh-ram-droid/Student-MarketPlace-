import { Router } from "express";
import { auth, adminOnly } from "../Middleware/auth.js";
import {
  addDomain,
  blockUser,
  getDashboardAnalytics,
  listDomains,
  listUsers,
  removeDomain,
  unblockUser
} from "../Controller/adminController.js";

const router = Router();

router.use(auth, adminOnly);

router.get("/analytics", getDashboardAnalytics);
router.get("/users", listUsers);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);
router.get("/domains", listDomains);
router.post("/domains", addDomain);
router.delete("/domains/:id", removeDomain);

export default router;
