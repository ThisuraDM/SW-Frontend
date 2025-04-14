export interface DealerPaymentDue {
    salesOrder: string;
    amount: string;
    invoiceNumber: string;
    invoiceDate: string;
    deliveryDate: string;
    amountCleared: string;
    paymentDue: string;
    dueDate?: any;
}