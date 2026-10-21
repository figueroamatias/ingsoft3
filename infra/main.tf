locals {
  backend_image  = "ghcr.io/figueroamatias/ingsoft3-backend:${var.app_version}"
  frontend_image = "ghcr.io/figueroamatias/ingsoft3-frontend:${var.app_version}"
}

resource "docker_network" "preprod" {
  name = "${var.project_name}-network"
}

resource "docker_volume" "postgres_data" {
  name = "${var.project_name}-postgres-data"
}

resource "docker_image" "postgres" {
  name         = "postgres:16-alpine"
  keep_locally = true
}

resource "docker_image" "backend" {
  name         = local.backend_image
  keep_locally = true
}

resource "docker_image" "frontend" {
  name         = local.frontend_image
  keep_locally = true
}

resource "docker_container" "postgres" {
  name    = "${var.project_name}-db"
  image   = docker_image.postgres.image_id
  restart = "unless-stopped"

  env = [
    "POSTGRES_DB=expenses",
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=${var.db_password}",
  ]

  networks_advanced {
    name = docker_network.preprod.name
  }

  volumes {
    volume_name    = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }

  volumes {
    host_path      = abspath("${path.module}/../database/init.sql")
    container_path = "/docker-entrypoint-initdb.d/001-init.sql"
    read_only      = true
  }

  healthcheck {
    test         = ["CMD-SHELL", "pg_isready -U postgres -d expenses"]
    interval     = "5s"
    timeout      = "3s"
    retries      = 20
    start_period = "5s"
  }
}

resource "docker_container" "backend" {
  name    = "${var.project_name}-backend"
  image   = docker_image.backend.image_id
  restart = "unless-stopped"

  env = [
    "APP_VERSION=${trimprefix(var.app_version, "sha-")}",
    "DB_HOST=${docker_container.postgres.name}",
    "DB_PORT=5432",
    "DB_NAME=expenses",
    "DB_USER=postgres",
    "DB_PASSWORD=${var.db_password}",
    "PORT=3000",
  ]

  networks_advanced {
    name = docker_network.preprod.name
  }

  ports {
    internal = 3000
    external = var.backend_port
  }

  depends_on = [docker_container.postgres]
}

resource "docker_container" "frontend" {
  name    = "${var.project_name}-frontend"
  image   = docker_image.frontend.image_id
  restart = "unless-stopped"

  env = [
    "APP_VERSION=${trimprefix(var.app_version, "sha-")}",
    "BACKEND_URL=http://${docker_container.backend.name}:3000",
  ]

  networks_advanced {
    name = docker_network.preprod.name
  }

  ports {
    internal = 80
    external = var.frontend_port
  }

  depends_on = [docker_container.backend]
}
