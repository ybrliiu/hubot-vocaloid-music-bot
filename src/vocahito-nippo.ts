import { Robot, Response } from 'hubot';
import Axios from 'axios';
import { JSDOM } from 'jsdom';

module.exports = (robot: Robot<any>) => {
  robot.hear(/ボカヒト日報見て/, (response: Response<Robot<any>>) => {
    fetchMoviesURL()
      .then(urls => {
        if ( urls.length === 0 ) {
          response.send('本日のボカロ曲はないみたいですね・・・。');
        }
        else {
          response.send(urls);
        }
      })
      .catch(err => { response.send(err) });
  });
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
              return 'Parse error ocured.';
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
