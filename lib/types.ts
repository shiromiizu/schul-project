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

export const Role = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
} as const;

export const RoleRecord = {
  STUDENT: { label: 'Schüler', value: 'student' },
  TEACHER: { label: 'Lehrer', value: 'teacher' },
  ADMIN: { label: 'Admin', value: 'admin' },
};

export type RoleValue = (typeof Role)[keyof typeof Role];

export const roleOptions = Object.values(RoleRecord);

export function getRoleLabel(role?: string | null) {
  if (!role) return null;
  const found = roleOptions.find((r) => r.value === role);
  return found ? found.label : role;
}

export type Feedback = {
  id: string;
  student_id: string;
  category: CategoryValue;
  title: string;
  description: string;
  seen_by_teacher: boolean;
  created_at: Date;
};

export type FeedbackReply = {
  id: string;
  feedback_id: string;
  teacher_id: string;
  message: string;
  created_at: Date;
  teacher?: {
    full_name: string;
  };
};

export type PetitionStatus = 'pending' | 'approved' | 'rejected';

export type Petition = {
  id: string;
  title: string;
  description: string;
  status: PetitionStatus;
  created_at: Date;
  student_name: string;
  votes: number;
};
