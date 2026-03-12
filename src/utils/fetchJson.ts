export default async function fetchJson(url: string, options = {}) {
  let response = await fetch(url, options);

  let data = await response.json();

  return data;
}
