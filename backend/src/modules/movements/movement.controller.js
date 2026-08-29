import { createMovementDto, toMovementDto } from "./movement.dto.js";
import * as movementService from "./movement.service.js";

export async function getAll(_request, response, next) {
  try {
    const movements = await movementService.getAllMovements();
    response.json(movements.map(toMovementDto));
  } catch (error) {
    next(error);
  }
}

export async function create(request, response, next) {
  try {
    const input = createMovementDto(request.body);
    const movement = await movementService.createMovement(input);
    response.status(201).json(toMovementDto(movement));
  } catch (error) {
    next(error);
  }
}
