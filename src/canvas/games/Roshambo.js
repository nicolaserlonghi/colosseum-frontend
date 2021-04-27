export default class Roshambo {

  constructor(canvasObj, canvasWidth, canvasHeight) {
    this.ctx = canvasObj.getContext("2d");
    this.SCALE = 0.1;
    this.OFFSET = 80;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  setLanguage(lang) {
    this.lang = lang;
  }

  started() {}

  synced() {}

  ended() {}

  async update(blobMessage) {
    // This is an example of how to convert it
    let text = await (new Response(blobMessage)).text();
    console.log('text: ', text);
  }

  handleCanvasClick(event) {
    // on each click get current mouse location
  }

  draw() {}

  handleCanvasResize() {
    let width = this.canvasObj.width;
    let height = this.canvasObj.height
  }
}