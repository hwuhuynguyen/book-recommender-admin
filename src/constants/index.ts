export const weekValue = [
  { value: 'MONDAY', label: 'Monday' },
  { value: 'TUESDAY', label: 'Tuesday' },
  { value: 'WEDNESDAY', label: 'Wednesday' },
  { value: 'THURSDAY', label: 'Thursday' },
  { value: 'FRIDAY', label: 'Friday' },
  { value: 'SATURDAY', label: 'Saturday' },
  { value: 'SUNDAY', label: 'Sunday' }
]

export const getMonthValue = () => {
  const data = []
  for (let i = 1; i <= 31; i++) {
    switch (i) {
      case 1:
      case 21:
      case 31:
        data.push({
          value: i.toString(),
          label: 'The ' + i.toString() + 'st day of the month'
        })
        break
      case 2:
      case 22:
        data.push({
          value: i.toString(),
          label: 'The ' + i.toString() + 'nd day of the month'
        })
        break
      case 3:
      case 23:
        data.push({
          value: i.toString(),
          label: 'The ' + i.toString() + 'rd day of the month'
        })
        break
      default:
        data.push({
          value: i.toString(),
          label: 'The ' + i.toString() + 'th day of the month'
        })
    }
  }
  return data
}

export const crawlOptions = [
  { value: 'WEEK', label: 'By week' },
  { value: 'MONTH', label: 'By month' }
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

export const BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
