export const Category = {
  TEACHER: 'LEHRER',
  BUILDING: 'GEBÄUDE',
  OTHER: 'SONSTIGES',
};

export const CategoryRecord = {
  TEACHER: { label: 'Lehrer', value: 'LEHRER' },
  BUILDING: { label: 'Gebäude', value: 'GEBÄUDE' },
  OTHER: { label: 'Sonstiges', value: 'SONSTIGES' },
};

// Type für die Kategoriewerte in der Datenbank
export type CategoryValue = (typeof Category)[keyof typeof Category];

// Array für die Verwendung in Select-Komponenten
export const categoryOptions = Object.values(CategoryRecord);
