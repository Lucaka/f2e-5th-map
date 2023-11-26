export function presidentHandler<T>(data: T[]) {
  const candidates = data[1] || []

  const candidatesKeys = Object.keys(candidates)
  const candidatesLength = candidatesKeys.length

  const list = data.slice(candidatesLength + 2).reduce<T[]>((acc, item) => {
    if (!item) return acc

    if (!acc.length) {
      acc.length = candidatesKeys.length

      candidatesKeys.forEach((key, index) => {
        acc[index] = {
          name: candidates[key as keyof typeof candidates],
          data: []
        }
      })
    }

    candidatesKeys.forEach((key, index) => {
      acc[index].data.push({
        county: item['Column1'] || '-',
        count: countHandler(item[key as keyof typeof item]) || NaN
      })
    })

    return acc
  }, [])

  return list
}

function countHandler(count: string | number | undefined): number {
  if (!count) return 0

  if (typeof count === 'number') return count

  return Number(count.replace(/,/g, ''))
}
