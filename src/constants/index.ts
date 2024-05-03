export const weekValue = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' }
]

export const getMonthValue = () => {
  const data = []
  for (let i = 1; i <= 31; i++) {
    switch (i) {
      case 1:
      case 21:
      case 31:
        data.push({
          value: i,
          label: 'The ' + i.toString() + 'st day of the month'
        })
        break
      case 2:
      case 22:
        data.push({
          value: i,
          label: 'The ' + i.toString() + 'nd day of the month'
        })
        break
      case 3:
      case 23:
        data.push({
          value: i,
          label: 'The ' + i.toString() + 'rd day of the month'
        })
        break
      default:
        data.push({
          value: i,
          label: 'The ' + i.toString() + 'th day of the month'
        })
    }
  }
  return data
}

export const crawlOptions = [
  { value: 'week', label: 'By week' },
  { value: 'month', label: 'By month' }
]

export const timeOptions = (startTime: string, endTime: string, interval: number) => {
  const timeSlots = []
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  let currentHour = startHour
  let currentMinute = startMinute

  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    const formattedHour = currentHour.toString().padStart(2, '0')
    const formattedMinute = currentMinute.toString().padStart(2, '0')
    const timeSlot = `${formattedHour}:${formattedMinute}`
    timeSlots.push({ value: timeSlot, label: timeSlot })

    // Increase time by interval
    currentMinute += interval
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60)
      currentMinute %= 60
    }
  }

  return timeSlots
}