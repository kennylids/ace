"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ClubEventInput, EventCategory } from "@/lib/types";

const categories: EventCategory[] = ["Clinic", "Doubles", "Singles ladder", "Social", "Junior"];

interface EventFormProps {
  initialValue?: ClubEventInput;
  submitLabel: string;
  onSubmit: (input: ClubEventInput) => void;
  onCancel: () => void;
}

const defaultValue: ClubEventInput = {
  title: "",
  category: "Clinic",
  date: "2026-07-11",
  time: "10:00",
  location: "",
  capacity: 30,
  description: "",
};

export function EventForm({ initialValue, submitLabel, onSubmit, onCancel }: EventFormProps) {
  const [form, setForm] = useState<ClubEventInput>(initialValue ?? defaultValue);

  function update<K extends keyof ClubEventInput>(key: K, value: ClubEventInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      title: form.title.trim() || "Untitled event",
      location: form.location.trim() || "Location TBA",
      description: form.description.trim() || "No description yet.",
      capacity: Number(form.capacity) || 1,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] px-5 pt-1.5 pb-8">
      <div>
        <Label htmlFor="title">Event title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Saturday Morning Cardio Clinic"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={form.category} onValueChange={(v) => update("category", v as EventCategory)}>
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="Court 1–3, Westside Tennis Club"
        />
      </div>

      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          type="number"
          min={1}
          value={form.capacity}
          onChange={(e) => update("capacity", Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Tell players what to expect, what to bring, and who it's for."
        />
      </div>

      <Button type="submit" className="mt-1.5">
        {submitLabel}
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
}
