import { TwitchApiCallType } from 'twitch-api-call';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import { createPaginatedResult } from '../HelixPaginatedResult';
import { HelixPagination, makePaginationQuery } from '../HelixPagination';
import { HelixPaginatedResponse } from '../HelixResponse';
import { HelixExtensionTransaction, HelixExtensionTransactionData } from './HelixExtensionTransaction';

/**
 * Filters for the extension transactions request.
 */
interface HelixExtensionTransactionsFilter {
	transactionIds?: string[];
}

/**
 * @inheritDoc
 */
interface HelixExtensionTransactionsPaginatedFilter extends HelixExtensionTransactionsFilter, HelixPagination {}

/**
 * The Helix API methods that deal with extensions.
 *
 * Can be accessed using `client.helix.extensions` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const transactions = await client.helix.extionsions.getExtensionTransactions('abcd');
 * ```
 */
export class HelixExtensionsApi extends BaseApi {
	/**
	 * Retrieves a list of transactions for the given extension.
	 *
	 * @param extensionId The ID of the extension to retrieve transactions for.
	 * @param filter Additional filters.
	 */
	async getExtensionTransactions(extensionId: string, filter: HelixExtensionTransactionsPaginatedFilter = {}) {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixExtensionTransactionData>>({
			type: TwitchApiCallType.Helix,
			url: 'extensions/transactions',
			query: {
				extension_id: extensionId,
				id: filter.transactionIds,
				...makePaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixExtensionTransaction, this._client);
	}

	/**
	 * Creates a paginator for transactions for the given extension.
	 *
	 * @param extensionId The ID of the extension to retrieve transactions for.
	 * @param filter Additional filters.
	 */
	getExtensionTransactionsPaginated(extensionId: string, filter: HelixExtensionTransactionsFilter = {}) {
		return new HelixPaginatedRequest(
			{
				url: 'extensions/transactions',
				query: {
					extension_id: extensionId,
					id: filter.transactionIds
				}
			},
			this._client,
			(data: HelixExtensionTransactionData) => new HelixExtensionTransaction(data, this._client)
		);
	}
}
