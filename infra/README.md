# Preprod efímero con Terraform

Este directorio implementa el Plan C aceptado por TP8: Terraform administra Docker local para crear un entorno nuevo llamado `preprod`. No importa, migra ni modifica QA, producción, Neon o Render.

## Recursos declarados

- Red Docker aislada.
- Volumen PostgreSQL persistente sólo mientras existe preprod.
- PostgreSQL 16 inicializado con `database/init.sql`.
- Backend y frontend desde las imágenes inmutables de GHCR del TP7.

El frontend recibe la dirección del backend a partir del nombre del contenedor y el backend recibe los datos de PostgreSQL desde el recurso de base. No se copian URLs de QA o producción.

## Requisitos y uso

Se usó Terraform 1.16.6 y el provider `kreuzwerker/docker` 4.x, fijado además por `infra/.terraform.lock.hcl` después de `init`.

En PowerShell, crear `local.tfvars` localmente con una contraseña nueva de al menos 12 caracteres y el tag SHA de una imagen publicada:

```powershell
New-Item -ItemType Directory -Force "$HOME/tfstate"
Set-Content local.tfvars @'
app_version = "sha-5e6e2ccad6d431c784af6dbf45c5a3ebbef91b4c"
db_password = "una-clave-local-de-preprod"
'@ -Encoding utf8
terraform init -backend-config="path=$HOME/tfstate/ingsoft3-preprod.tfstate"
terraform fmt -check
terraform validate
terraform plan -var-file=local.tfvars
terraform apply -var-file=local.tfvars
```

Comprobar el entorno completo:

```powershell
Invoke-RestMethod http://localhost:8090/health
Invoke-RestMethod http://localhost:8090/api/categories
Invoke-WebRequest http://localhost:8091/
```

Al terminar una sesión se destruye preprod, sin afectar QA ni producción:

```powershell
terraform destroy -var-file=local.tfvars
```

El state queda fuera del repositorio, en `$HOME/tfstate/ingsoft3-preprod.tfstate`. Puede contener datos sensibles y es la memoria que vincula el código con los recursos Docker existentes; perderlo no destruye recursos, pero obliga a importarlos o recrearlos. En un equipo se movería a un backend remoto con locking. En este TP el estado local es el mecanismo indicado por la cátedra.
