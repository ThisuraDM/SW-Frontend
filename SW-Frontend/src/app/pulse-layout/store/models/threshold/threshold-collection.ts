export interface ThresholdsCollection{
    collection_header_id: number;
    threshold_collection_item_list: ThresholdCollectionList[];
}

export interface ThresholdCollectionList{
    id: number,
    bank_in_type: string,
    bank_in_time: string,
    bank_in_amount: string,
    threshold_attachment:ThresholdAttachment
    reference_id: string
}

export interface ThresholdAttachment{
    id: number,
    file_path: string,
    file_name: string
}
