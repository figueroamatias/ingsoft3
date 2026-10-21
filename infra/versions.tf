terraform {
  required_version = ">= 1.16.0, < 2.0.0"

  backend "local" {}

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 4.0"
    }
  }
}
