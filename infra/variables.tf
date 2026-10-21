variable "app_version" {
  description = "Tag inmutable sha-<commit> publicado en GHCR para backend y frontend."
  type        = string

  validation {
    condition     = can(regex("^sha-[0-9a-f]{40}$", var.app_version))
    error_message = "app_version debe tener el formato sha- seguido de un SHA de 40 caracteres hexadecimales."
  }
}

variable "db_password" {
  description = "Contraseña local de PostgreSQL exclusiva de preprod; nunca se versiona."
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.db_password) >= 12
    error_message = "db_password debe tener al menos 12 caracteres."
  }
}

variable "project_name" {
  description = "Prefijo aislado para los recursos Docker del entorno efímero."
  type        = string
  default     = "ingsoft3-preprod"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "project_name sólo puede contener minúsculas, números y guiones."
  }
}

variable "backend_port" {
  description = "Puerto de host para la API de preprod, distinto de los puertos locales del TP2."
  type        = number
  default     = 8090
}

variable "frontend_port" {
  description = "Puerto de host para el frontend de preprod, distinto de los puertos locales del TP2."
  type        = number
  default     = 8091
}
