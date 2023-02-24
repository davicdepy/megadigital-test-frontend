export default async function serviceFetch(url, methodSend, bodySend) {
  const requestOptions = {
    method: methodSend,
    headers: { "Content-Type": "application/json" },
    body: bodySend ? JSON.stringify(bodySend) : "",
  };

  if (methodSend === "GET" || methodSend === "DELETE") {
    delete requestOptions.body;
  }

  return fetch(url, requestOptions)
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
}
