import { Router }            from "express";
import { authenticate }      from "../../middleware/auth.middleware.js";
import { requireMaintainer } from "../../middleware/role.middleware.js";
import {
  createIssueHandler,
  getAllIssuesHandler,
  getIssueByIdHandler,
  updateIssueHandler,
  deleteIssueHandler,
} from "./issues.controller.js";

const router = Router();

router.get(   "/",    getAllIssuesHandler);
router.get(   "/:id", getIssueByIdHandler);
router.post(  "/",    authenticate,                    createIssueHandler);
router.patch( "/:id", authenticate,                    updateIssueHandler);
router.delete("/:id", authenticate, requireMaintainer, deleteIssueHandler);

export default router;