function SearchError_notExistId(id: number): string {
  return `SearchError: Element with ${id} not exist`
}

export const errors = {
  SearchError: {
    notExistId: (id: number) => {
      return {
        error: `SearchError: Element with ${id} not exist`,
        status: 404
      }
    }
  }
}