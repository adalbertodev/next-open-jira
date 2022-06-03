interface SeedData {
  entries: SeedEntry[];
}

interface SeedEntry {
  description: string;
  status: string;
  createdAt: number;
}

export const seedData: SeedData = {
  entries: [
    {
      description: 'Lo que sea',
      status: 'pending',
      createdAt: Date.now()
    },
    {
      description: 'Lo que sea 2',
      status: 'in-progress',
      createdAt: Date.now() - 1000000
    },
    {
      description: 'Lo que sea 3',
      status: 'finished',
      createdAt: Date.now() - 100000
    }
  ]
};
