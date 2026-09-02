import {
  createMovementDto,
  toFinancialSummaryDto,
  toMovementDto,
} from "./movement.dto.js";
import * as movementService from "./movement.service.js";

export async function getAll(request, response, next) {
  try {
    const movements = await movementService.getAllMovements(request.user.id);
    response.json(movements.map(toMovementDto));
  } catch (error) {
    next(error);
  }
}

export async function getSummary(request, response, next) {
  try {
    const summary = await movementService.getFinancialSummary(request.user.id);
    response.json(toFinancialSummaryDto(summary));
  } catch (error) {
    next(error);
  }
}

export async function create(request, response, next) {
  try {
    const input = createMovementDto(request.body);
    const movement = await movementService.createMovement(request.user.id, input);
    response.status(201).json(toMovementDto(movement));
  } catch (error) {
    next(error);
  }
}
