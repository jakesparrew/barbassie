// lib/content.ts
import popupRaw from "@/content/popup.json"
import jobsRaw from "@/content/jobs.json"
import hoursRaw from "@/content/hours.json"
import { type Popup } from "./popup"

export type Job = {
  id: string
  title: { en: string; nl: string; fr: string }
  description: { en: string; nl: string; fr: string }
  applyEmail: string
}

export type HoursEntry = {
  weekday: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
  open?: string
  close?: string
}

export const getPopup = (): Popup => popupRaw as Popup
export const getJobs = (): Job[] => jobsRaw as Job[]
export const getHours = (): HoursEntry[] => hoursRaw as HoursEntry[]
