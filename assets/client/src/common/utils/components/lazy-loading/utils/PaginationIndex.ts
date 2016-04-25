import {AppContext} from '../../../AppContext';
import {TotalCountDO} from '../../../../../pages/internal/services/common/data-objects/lazy-load/TotalCountDO';
import {PageMetaDO} from '../../../../../pages/internal/services/common/data-objects/lazy-load/PageMetaDO';

interface PagePaginationIndex {
	pageNumber: number;
	displayNumber: number;
	isSelected: boolean;
}

export class PaginationIndex {
	public static DefaultItemsPerPage = 10;

	numOfItemsPerPage: number = PaginationIndex.DefaultItemsPerPage;
	nunOfItemsPerPageList: number[] = [
		10,
		25,
		50,
		100
	];

	firstPageNumber: number;
	lastPageNumber: number;

	indexList: PagePaginationIndex[];
	pageNumberStat: string;

	constructor(private _appContext: AppContext) {
	}

	public buildPaginationOptions(totalCount: TotalCountDO, pageMeta: PageMetaDO) {
		this.firstPageNumber = 0;
		this.lastPageNumber = totalCount.getLastPageIndex(this.numOfItemsPerPage);
		this.indexList = [];
		this.addPaginationIndex(pageMeta.pageNumber - 1, pageMeta);
		this.addPaginationIndex(pageMeta.pageNumber, pageMeta);
		this.addPaginationIndex(pageMeta.pageNumber + 1, pageMeta);

		var fromIndex = (pageMeta.pageNumber * pageMeta.pageSize) + 1;
		if (totalCount.numOfItems == 0) {
			fromIndex = 0;
		}
		this.pageNumberStat = this._appContext.thTranslation.translate("Showing %fromIndex% to %toIndex% of %totalCount% items",
			{
				fromIndex: fromIndex,
				toIndex: Math.min(((pageMeta.pageNumber + 1) * pageMeta.pageSize), totalCount.numOfItems),
				totalCount: totalCount.numOfItems
			})
	}

	private addPaginationIndex(pageNumber: number, pageMeta: PageMetaDO) {
		if (pageNumber < this.firstPageNumber || pageNumber > this.lastPageNumber) {
			return;
		}
		this.indexList.push({
			displayNumber: pageNumber + 1,
			pageNumber: pageNumber,
			isSelected: pageNumber === pageMeta.pageNumber
		});
	}

	public isInvalidPageNumber(totalCount: TotalCountDO, pageMeta: PageMetaDO): boolean {
		var lastItemIndex = totalCount.numOfItems - 1;
		if (lastItemIndex < 0) {
			lastItemIndex = 0;
		}
		var indexOfFirstItemFromCurrentPage = pageMeta.pageNumber * pageMeta.pageSize;
		return lastItemIndex < indexOfFirstItemFromCurrentPage;
	}

	public defaultNoOfItemsPerPageIsSelected() {
		return this.numOfItemsPerPage === PaginationIndex.DefaultItemsPerPage;
	}

	public getUpdatedPageNumber(totalCount: TotalCountDO, pageMeta: PageMetaDO, selectedIndex: number): number {
		var actualIndex = pageMeta.pageNumber * pageMeta.pageSize + selectedIndex;
		return Math.floor(actualIndex / PaginationIndex.DefaultItemsPerPage);
	}

}