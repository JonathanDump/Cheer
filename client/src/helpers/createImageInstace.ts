export default async function createImageInstance(blob: Blob) {
  const reader = new FileReader();
  const loadPromise = new Promise<string>((resolve) => {
    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });
  });

  reader.readAsDataURL(blob);
  const url = await loadPromise;
  return { blob, url };
}
