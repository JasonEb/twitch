import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../../ApiClient';
import { HelixDateRangeData } from '../HelixDateRangeData';
import { HelixResponse } from '../HelixResponse';
import { HelixBitsLeaderboardEntry, HelixBitsLeaderboardEntryData } from './HelixBitsLeaderboardEntry';

/** @private */
export interface HelixBitsLeaderboardResponse extends HelixResponse<HelixBitsLeaderboardEntryData> {
	date_range: HelixDateRangeData;
	total: number;
}

/**
 * A leaderboard where the users who used the most bits to a broadcaster are listed.
 */
@Cacheable
export class HelixBitsLeaderboard {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: HelixBitsLeaderboardResponse, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The entries of the leaderboard.
	 */
	@CachedGetter()
	get entries() {
		return this._data.data.map(entry => new HelixBitsLeaderboardEntry(entry, this._client));
	}

	/**
	 * The total amount of people on the requested leaderboard.
	 */
	get totalCount() {
		return this._data.total;
	}
}
