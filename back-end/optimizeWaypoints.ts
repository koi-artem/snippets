import HEREParamsBuilder from 'services/optimization/hereParamsBuilder';
import waypointAdapter from 'services/optimization/adapters/waypointsAdapter';
import driversAdapter, { IOptimizationLocations } from 'services/optimization/adapters/driversAdapter';

import {
  EDriverLocationType,
} from 'definitions/interfaces/IHereTouring';
import { IManager } from 'definitions/interfaces/manager';
import { addDriverRoute, getDriverRoutes } from 'services/optimization/services/routesService';
import {
  updateFulfilledResultsWithUnassigned,
} from 'services/optimization/postOptimizationHelpers';
import { applyStrategiesAndOptimize } from './services/optimizationService';
import { getDriversForOptimization } from './services/driversService';
import {
  getWaypoints,
  getWaypointsOrders,
} from './services/waypointsService';

import checkOrderWaypointsSequence from './helpers/checkOrderWaypointsSequence';

const validateBeforeRequest = (hereParamsBuilder: HEREParamsBuilder) => {
  const { fleet } = hereParamsBuilder.build();

  if (fleet.types.length < 1) {
    throw new Error('No available drivers');
  }
};

// @ts-ignore
export const optimizeWaypoints = async (
  optimizationDate: string,
  optimizationTime: string,
  manager: IManager,
  waypointIdsToOptimize: string[],
  driverIdsToUseInOptimization: string[] = [],
  driverStartLocationType: EDriverLocationType = EDriverLocationType.CURRENT_LOCATION,
  driverStartLocationValue: IOptimizationLocations | null = null,
  driverEndLocationType: EDriverLocationType = EDriverLocationType.WAREHOUSE,
  driverEndLocationValue: IOptimizationLocations | null = null,
): Promise<any> => {
  const unassigned = new Map<string, { code: string, description: string }[]>();

  if (!manager) {
    throw new Error('Optimization requires manager entity to be defined.');
  }

  if (waypointIdsToOptimize.length < 1) {
    throw new Error('Optimization requires at least 1 waypoint.');
  }

  const requestWaypoints = await getWaypoints(waypointIdsToOptimize);
  const waypointsOrders = await getWaypointsOrders(waypointIdsToOptimize);

  if (requestWaypoints.length !== waypointIdsToOptimize.length) {
    throw new Error('Optimization requires at least 1 waypoint.');
  }

  if (requestWaypoints.every((waypoint) => !waypoint.route.from)) {
    throw new Error('Only Collection waypoints were provided.');
  }

  // Order sequence constraint check
  const errorWaypoints = checkOrderWaypointsSequence(requestWaypoints, waypointsOrders);
  errorWaypoints.forEach(({ jobId, description }) => {
    unassigned.set(jobId, [{
      code: 'ORDER_SEQUENCE_CONSTRAINT',
      description,
    }]);
  });

  const validRequestWaypoints = requestWaypoints.filter(({ _id }) => {
    const index = errorWaypoints.findIndex(({
      waypointId: errorWaypointId,
    }) => errorWaypointId === _id.toString());
    return index === -1;
  });

  // Start building HERE Request body
  const hereParamsBuilder = new HEREParamsBuilder();

  hereParamsBuilder.meta.routeDate = new Date(optimizationDate);

  // Add staged waypoints to the builder
  validRequestWaypoints.forEach((waypoint) => {
    const waypointId = waypoint._id.toString();
    const order = waypointsOrders.get(waypointId);
    const orderId = order._id.toString();
    try {
      waypointAdapter(
        hereParamsBuilder,
        waypoint,
        order,
        manager.timezone,
        optimizationTime,
      );
    } catch (e) {
      unassigned.set(`${orderId}_${waypointId}`, [{
        code: 'TIME_WINDOW_CONSTRAINT',
        description: e.message,
      }]);
    }
  });

  const drivers = await getDriversForOptimization(
    driverIdsToUseInOptimization,
    manager,
    hereParamsBuilder.meta.routeDate,
  );

  if (drivers.length < 1) {
    throw new Error('No available drivers.');
  }

  // Add available fleet to the builder
  for (const driver of drivers) {
    try {
      const routes = await getDriverRoutes(driver._id.toString(), hereParamsBuilder.meta.routeDate) || [];

      if (routes.length > 1) {
        throw new Error('Number of routes assigned to driver is more than one.');
      }

      const [route] = routes || [];

      if (route) {
        const isAlreadyStarted = route.status !== 'awaiting';
        if (isAlreadyStarted) {
          continue;
        }

        addDriverRoute(manager, driver, route, hereParamsBuilder);
      }

      // Driver has more than one route on this date. Not applicable.

      driversAdapter(
        hereParamsBuilder,
        optimizationTime,
        route?.meta?.driverStartLocation ?? driverStartLocationType,
        route?.meta?.driverStartLocationValues ?? driverStartLocationValue,
        route?.meta?.driverEndLocation ?? driverEndLocationType,
        route?.meta?.driverEndLocationValues ?? driverEndLocationValue,
        driver,
        manager,
        route?.meta?.optimizationTime,
      );
    } catch (e) {
      console.log(`Couldn't add driver ${driver._id} to optimization`, e.message);
    }
  }

  if (!hereParamsBuilder.hasFleetTypes()) {
    throw new Error('No available drivers with known location.');
  }

  validateBeforeRequest(hereParamsBuilder);

  const [
    balanced,
    fastest,
    minVehicle,
    cheapest,
  ] = await applyStrategiesAndOptimize(hereParamsBuilder, waypointIdsToOptimize)
    .then((responses) => responses.map((response:any) => {
      const { status } = response;

      if (status === 'rejected') {
        const { reason = 'Internal error' } = response?.reason || {};
        throw new Error(`Optimization error: ${reason}`);
      }

      return response;
    }))
    .then(updateFulfilledResultsWithUnassigned(unassigned));

  return {
    balanced,
    fastest,
    minVehicle,
    cheapest,
  };
};
