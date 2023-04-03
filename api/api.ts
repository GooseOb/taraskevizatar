import { Tarask, Promisify } from '../scripts/taraskTypes';

const tarask: Promisify<Tarask> = (
  text,
  isHtml,
  { abc: alphabet, j: alwaysJ },
) => {
  return fetch('http://localhost:3000/', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ text, alphabet, alwaysJ }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((res) => {
    if (res.ok) return res.text();
    else return 'error';
  });
};

export default tarask;
