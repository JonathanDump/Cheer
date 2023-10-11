export default function getItemFromLocalStorage<T>(itemName: string): T {
  const item = localStorage.getItem(itemName)!;
  if (itemName === "user") {
    return JSON.parse(item);
  }
  return item as T;
}
