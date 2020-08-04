const convertHourToMinutes = (el: string): number => {
    const [hour, minutes] = el.split(":").map((el) => +el)
    const timeMinutes = hour * 60 + minutes
    return timeMinutes
}

export default convertHourToMinutes
