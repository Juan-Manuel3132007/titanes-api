export interface Paginacion {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Formato que pide el profesor: { pagination, data }
export interface Paginado<T> {
  pagination: Paginacion;
  data: T[];
}

export function paginar<T>(items: T[], total: number, page: number, limit: number): Paginado<T> {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: items,
  };
}