export const generateRange = (start: number, end: number) => {
  const length = end + 1 - start

  return Array.from({ length }, (_, id) => id + start)
}

export const removeEmptyFields = (obj: any) => {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      for (let i = obj.length - 1; i >= 0; i--) {
        removeEmptyFields(obj[i])
        if (Object.keys(obj[i]).length === 0) {
          obj.splice(i, 1)
        }
      }
    } else {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          removeEmptyFields(obj[key])
          if (obj[key] === '') {
            delete obj[key]
          }
        }
      }
    }
  }
}

export const convertDateFormat = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
