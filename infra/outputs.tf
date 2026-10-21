output "backend_url" {
  description = "URL derivada de la API del entorno preprod local."
  value       = "http://localhost:${var.backend_port}"
}

output "frontend_url" {
  description = "URL derivada del frontend del entorno preprod local."
  value       = "http://localhost:${var.frontend_port}"
}

output "backend_image" {
  description = "Referencia inmutable del backend promovido a preprod."
  value       = local.backend_image
}

output "frontend_image" {
  description = "Referencia inmutable del frontend promovido a preprod."
  value       = local.frontend_image
}
