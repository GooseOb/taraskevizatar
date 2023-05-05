import {TaraskAsync} from '@scripts';

export const tarask: TaraskAsync = async (
    text,
    isHtml,
    { abc: alphabet, j: alwaysJ },
) => {
  const res = await fetch(process.env.API_URL, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ text, alphabet, alwaysJ, isHtml }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  if (res.ok) return res.text();
  throw new Error(res.statusText);
};
