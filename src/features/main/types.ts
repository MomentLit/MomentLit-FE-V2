export type MainSpaceItem = {
  id: number;
  title: string;
  price: string;
  category: string;
  address: string;
  imageUrl?: string;
};

export type MainHero = MainSpaceItem & {
  period: string;
};
