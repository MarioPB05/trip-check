export interface Item {
  id: number;
  emojiUrl: string;
  name: string;
  deleted: boolean;
}

export interface ItemWithQuantity {
  item: Item;
  quantity: number;
}

export interface ItemWithUsages extends Item {
  timesUsed: number;
}

export interface ItemStats {
  totalQuantity: string;
  lostQuantity: string;
  usageFrequency: string;
}
