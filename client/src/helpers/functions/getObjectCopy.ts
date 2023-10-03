export default function getObjectCopy(object: unknown) {
  return JSON.parse(JSON.stringify(object));
}
