// components/ui/Icon.tsx
import * as L from "lucide-react"
import { type LucideProps } from "lucide-react"

export const Icon = {
  Whatsapp: (p: LucideProps) => <L.MessageCircle {...p} />,
  Instagram: (p: LucideProps) => <L.Camera {...p} />,
  MapPin: (p: LucideProps) => <L.MapPin {...p} />,
  X: (p: LucideProps) => <L.X {...p} />,
  ChevronDown: (p: LucideProps) => <L.ChevronDown {...p} />,
  Mail: (p: LucideProps) => <L.Mail {...p} />,
  Clock: (p: LucideProps) => <L.Clock {...p} />,
  Globe: (p: LucideProps) => <L.Globe {...p} />,
} as const
