"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', userController_1.getUserMetrics);
router.put('/', userController_1.updateUserMetrics);
router.delete('/:userId', auth_1.authenticateToken, userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userroutes.js.map