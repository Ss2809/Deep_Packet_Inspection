import { Router } from 'express';
import { addRule, clearRules, listRules, removeRule } from '../controllers/rulesController.js';
export const rulesRouter = Router();
rulesRouter.get('/rules', listRules); rulesRouter.post('/rules', addRule); rulesRouter.delete('/rules', removeRule); rulesRouter.delete('/rules/all', clearRules);
