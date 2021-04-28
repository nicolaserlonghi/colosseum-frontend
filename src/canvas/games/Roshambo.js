export default class Roshambo {

  constructor(canvasObj, lang) {
    this.canvasObj = canvasObj;
    this.lang = lang;
    this.ctx = canvasObj.getContext("2d");
  }

  started() {}

  synced() {}

  ended() {}

  update(blobMessage) {
    // This is an example of how to convert it
    // let text = await (new Response(blobMessage)).text();
    // console.log('text: ', text);
  }
}