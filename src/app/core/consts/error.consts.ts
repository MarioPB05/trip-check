import { ErrorInterface } from '@core/interfaces/error.interface';

export const NotFoundError: ErrorInterface = {
  title: 'No se encontró el recurso',
  message: 'El recurso que estás buscando no existe o ha sido eliminado.',
  type: 'not_found',
  gravity: 'high',
};

export const ServerError: ErrorInterface = {
  title: 'Error del servidor',
  message: 'Ocurrió un error en el servidor. Por favor, inténtalo de nuevo más tarde.',
  type: 'server',
  gravity: 'high',
};

export const NetworkError: ErrorInterface = {
  title: 'Error de red',
  message: 'No se pudo conectar al servidor. Verifica tu conexión a internet e inténtalo de nuevo.',
  type: 'network',
  gravity: 'high',
};

export const ValidationError: ErrorInterface = {
  title: 'Error de validación',
  message:
    'Los datos ingresados no son válidos. Por favor, corrige los errores e inténtalo de nuevo.',
  type: 'validation',
  gravity: 'low',
};

export const TimeoutError: ErrorInterface = {
  title: 'Tiempo de espera agotado',
  message: 'La solicitud ha tardado demasiado tiempo en responder. Por favor, inténtalo de nuevo.',
  type: 'timeout',
  gravity: 'low',
};

export const UnknownError: ErrorInterface = {
  title: 'Error desconocido',
  message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
  type: 'unknown',
  gravity: 'high',
};

export const GeneralError: ErrorInterface = {
  title: 'Error',
  message: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
  type: 'general',
  gravity: 'high',
};
