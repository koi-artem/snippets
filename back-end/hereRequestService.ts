import { IHereTouringBody } from 'definitions/interfaces/IHereTouring';
import {
    IHERERequestParams,
    excludeAvoidFeature,
    isAvoidNotAllowed,
    tryRequest,
} from 'services/optimization/services/hereRequestServiceHelpers';
import hereAuth from '../../hereAuth';

export interface IHERETouringParams extends IHERERequestParams {
    body: IHereTouringBody
}

class HEREService {
    static async authenticatedRequest(params: IHERERequestParams) {
        let token;
        try {
            token = await hereAuth.getToken();
        } catch (e) {
            throw new Error('[HERE authorization error] Can`t get access token.');
        }

        return tryRequest(token, params);
    }

    async calculateRouteMetrics(origin, destination, intermediateStops) {
        try {
            const via = intermediateStops
                .map((stop) => `&via=${stop.lat},${stop.lng}!stopDuration=${stop.serviceTime}`)
                .join('');

            const queryParameters = {
                routingMode: 'fast',
                transportMode: 'car',
                origin: `${origin.lat},${origin.lng}`,
                destination: `${destination.lat},${destination.lng}!stopDuration=${destination.serviceTime}`,
                return: 'travelSummary,polyline',
            };

            const searchParams = new URLSearchParams(queryParameters);
            return await HEREService.authenticatedRequest({
                url: `https://router.hereapi.com/v8/routes?${searchParams.toString()}${via || ''}`,
                method: 'GET',
            });
        } catch (e) {
            throw new Error(`[HERE ROUTE METRICS] Error: ${e}`);
        }
    }

    async touringAsyncRequest(body: IHereTouringBody) {
        try {
            return await this.asyncRequest({
                url: 'https://tourplanning.hereapi.com/v2/problems/async',
                method: 'POST',
                body,
            });
        } catch (error) {
            return this.handleTouringRequestError(error, body);
        }
    }

    async asyncRequest(params: IHERETouringParams) {
        const startTime = new Date().getTime();
        const responseWithStatus: any = await HEREService.authenticatedRequest(params);
        const result = await this.resolveAsyncResponse(responseWithStatus);
        const endTime = new Date().getTime();
        console.log(`[HERE API REQUEST] Request took ${(endTime - startTime) / 1000} seconds.`);
        return result;
    }

    async handleTouringRequestError(error, body: IHereTouringBody) {
        if (isAvoidNotAllowed(error)) {
            console.log('Avoid is not allowed. Exclude limitation.');
            const adjustedBody = excludeAvoidFeature(body);
            return this.touringAsyncRequest(adjustedBody);
        }

        console.error('[HERE REQUEST ERROR]', error);
        throw error;
    }

    resolveAsyncResponse(response) {
        return new Promise(((resolve, reject) => this._resolveAsyncResponse(response, resolve, reject)));
    }

    async _resolveAsyncResponse(response, resolve, reject) {
        const { href: statusURL } = response;
        try {
            const {
                status,
                resource = null,
                error = null,
            } = await HEREService.authenticatedRequest({ url: statusURL, method: 'GET' });

            switch (status) {
                case 'success': {
                    console.log('[HERE API REQUEST] Success');
                    const { href: solutionURL } = resource;
                    const solution = await HEREService.authenticatedRequest({ url: solutionURL, method: 'GET' });
                    resolve(solution);
                    break;
                }
                case 'failure':
                    console.log('[HERE API REQUEST] Failure');
                    reject(error);
                    break;
                default:
                    console.log('[HERE API REQUEST] Pending');
                    setTimeout(() => this._resolveAsyncResponse(response, resolve, reject), 30000);
                    break;
            }
        } catch (e) {
            return e;
        }
        return null;
    }
}

export default new HEREService();
