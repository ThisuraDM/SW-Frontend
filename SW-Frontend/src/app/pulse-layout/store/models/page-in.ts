import { EWalletTransactionItem } from './e-wallet-transaction-history-data';

export interface PageIn {
    pageSize: number;
    page: number;
    total: number;
    filteredTransactionItemList: EWalletTransactionItem[];
}
