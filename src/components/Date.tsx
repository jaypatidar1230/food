export const getDDMMYYYYDateWithTime = (dateString: any) => {
  const date = new Date(dateString);
  const day = date.getDate().toString();
  const month = (date.getMonth() + 1).toString();
  const year = date.getFullYear();

  const formattedMonth = month.padStart(2, "0");
  const formattedDay = day.padStart(2, "0");

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${formattedDay}/${formattedMonth}/${year} ${hours}:${minutes}:${seconds}`;
};
