import { Robot } from 'hubot';
import Axios from 'axios';
import { JSDOM } from 'jsdom';

declare module 'hubot' {
  interface Robot<A> {
    send(...strings: string[]): void;
  }
}

module.exports = (robot: Robot<any>) => {
  fetchMoviesURL()
    .then(urls => { robot.send(urls) })
    .catch(err => { robot.send(err) });
};

async function fetchMoviesURL(): Promise<string> {

  const urls =
    await Axios.get('http://cobachican.hatenadiary.jp/')
      .then(response => {
        const dom      = new JSDOM(response.data);
        const articles = dom.window.document.querySelectorAll('article');
        if ( articles !== null ) {
          const iframes = articles.item(0).querySelectorAll('iframe');
          return Array.prototype.map.apply(iframes, [(iframe: HTMLElement) => {
            const src = iframe.getAttribute('src');
            if ( src !== null ) {
              const splited = src.split('/');
              return 'https://www.nicovideo.jp/watch/' + splited[ splited.length - 1 ];
            }
            else {
              return 'parse error ocured.';
            }
          }]).join("\n");
        }
        else {
          return 'There are no articles.'
        }
      })
      .catch(error => { return error });

  return urls;
}
