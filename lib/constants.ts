import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const statuses = [
  {
    label: "Por hacer",
    value: "TO_DO",
    icon: CircleIcon,
  },
  {
    label: "En progreso",
    value: "IN_PROGRESS",
    icon: StopwatchIcon,
  },
  {
    label: "Realizada",
    value: "DONE",
    icon: CheckCircledIcon,
  },
  {
    label: "Cancelada",
    value: "CANCELLED",
    icon: CrossCircledIcon,
  },
] as const;

export const repeat = [
  {
    label: "Diario",
    value: "DAILY",
  },
  {
    label: "Semanal",
    value: "WEEKLY",
  },
  {
    label: "Mensual",
    value: "MONTHLY",
  },
  {
    label: "Anual",
    value: "YEARLY",
  },
  {
    label: "Nunca",
    value: "NEVER",
  },
] as const;
