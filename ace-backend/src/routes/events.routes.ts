import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as eventsService from "../services/events.service.js";
import { authGuard, adminGuard } from "../middleware/auth.js";

const router = Router();

const categoryEnum = z.enum(["CLINIC", "DOUBLES", "SINGLES_LADDER", "SOCIAL", "JUNIOR"]);

const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  category: categoryEnum,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.string().min(1).max(300),
  capacity: z.number().int().min(1),
  description: z.string().min(1),
});

const updateEventSchema = createEventSchema.partial();

router.get("/", authGuard, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category as string | undefined;
    const events = await eventsService.listEvents(category);
    res.json(events);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authGuard, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventsService.getEvent(req.params.id);
    res.json(event);
  } catch (err) {
    next(err);
  }
});

router.post("/", authGuard, adminGuard, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createEventSchema.parse(req.body);
    const event = await eventsService.createEvent(input, req.user!.userId);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authGuard, adminGuard, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateEventSchema.parse(req.body);
    const event = await eventsService.updateEvent(req.params.id, input);
    res.json(event);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authGuard, adminGuard, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventsService.deleteEvent(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/:id/join", authGuard, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const participant = await eventsService.joinEvent(req.params.id, req.user!.userId);
    res.status(201).json(participant);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/join", authGuard, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventsService.leaveEvent(req.params.id, req.user!.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
