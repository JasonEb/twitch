import AuthProvider from './AuthProvider';
import { NonEnumerable } from '../Toolkit/Decorators/NonEnumerable';
import AccessToken from '../API/AccessToken';

/**
 * An auth provider that always returns the same initially given credentials.
 *
 * You are advised to roll your own auth provider that can handle scope upgrades,
 * or to plan ahead and supply only access tokens that account for all scopes
 * you will ever need (not recommended).
 */
export default class StaticAuthProvider implements AuthProvider {
	@NonEnumerable private readonly _clientId: string;
	@NonEnumerable private _accessToken?: AccessToken;
	private readonly _scopes: string[] = [];

	/**
	 * Creates a new auth provider with static credentials.
	 *
	 * You don't usually have to create this manually. You should use `TwitchClient.withCredentials` instead.
	 *
	 * @param clientId The client ID.
	 * @param accessToken The access token to provide.
	 *
	 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
	 * @param scopes The scopes this token has.
	 */
	constructor(clientId: string, accessToken?: string, scopes: string[] = []) {
		this._clientId = clientId || '';
		if (accessToken) {
			this._accessToken = new AccessToken({ access_token: accessToken, scope: scopes.join(' '), refresh_token: '' });
			this._scopes = scopes;
		}
	}

	/**
	 * Retrieves an access token.
	 *
	 * If the current access token does not have the requested scopes, this method throws.
	 * This makes supplying an access token with the correct scopes from the beginning necessary.
	 *
	 * @param scopes The requested scopes.
	 */
	async getAccessToken(scopes?: string | string[]) {
		if (scopes) {
			if (typeof scopes === 'string') {
				scopes = scopes.split(' ');
			}
			if (scopes.some(scope => !this._scopes.includes(scope))) {
				throw new Error(`This token does not have the requested scopes (${scopes.join(', ')}) and can not be upgraded`);
			}
		}

		return this._accessToken || null;
	}

	/** @private */
	setAccessToken(token: AccessToken) {
		this._accessToken = token;
	}

	/**
	 * The client ID.
	 */
	get clientId() {
		return this._clientId;
	}

	/**
	 * The scopes that are currently available using the access token.
	 */
	get currentScopes() {
		return this._scopes;
	}
}