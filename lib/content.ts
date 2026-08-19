// lib/content.ts
import popupRaw from "@/content/popup.json"
import jobsRaw from "@/content/jobs.json"
import hoursRaw from "@/content/hours.json"
import legalRaw from "@/content/legal.json"
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

/** One section of a legal document. `after` renders below the bullet list. */
export type LegalSection = {
  heading: string
  body?: string[]
  items?: string[]
  after?: string[]
}

export type LegalDoc = {
  slug: string
  title: string
  /** ISO date shown as "last updated". */
  updated: string
  intro: string
  sections: LegalSection[]
}

const legalDocs = legalRaw as Record<string, LegalDoc>

export const legalSlugs = Object.keys(legalDocs)
export const getLegalDoc = (slug: string): LegalDoc | undefined => legalDocs[slug]
