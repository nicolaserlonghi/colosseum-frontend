export default class Example {

  constructor(canvasObj, lang) {
    this.canvasObj = canvasObj;
    this.ctx = canvasObj.getContext("2d");
    this.lang = lang;
    this.canvasObj.onclick = (event) => this.handleCanvasClick(event)
    this.SCALE = 0.1;
    this.OFFSET = 80;
    this.coordinates = [];
  }

  started() {}

  synced() {}

  ended() {}

  update(blobMessage) {
    // This is an example of how to convert it
    // let text = await (new Response(blobMessage)).text();
    // console.log('text: ', text);
  }

  handleCanvasClick(event) {
    let rect = this.canvasObj.getBoundingClientRect(),
      scaleX = this.canvasObj.width / rect.width,
      scaleY = this.canvasObj.height / rect.height;
    let xClick = (event.clientX - rect.left)  * scaleX;
    let yClick = (event.clientY - rect.top) * scaleY
    const currentCoord = { x: xClick, y: yClick};
    this.coordinates = [...this.coordinates, currentCoord]
    this.draw();
  }

  draw() {
    this.clear();
    this.coordinates.forEach(coordinate => {
      // Path2D for a start SVG
      const starSVG = "m55,237 74-228 74,228L9,96h240"
      const SVG_PATH = new Path2D(starSVG);
      this.ctx.fillStyle = 'red';
      this.ctx.shadowColor = 'blue';
      this.ctx.shadowBlur = 15;
      this.ctx.save();
      this.ctx.scale(this.SCALE, this.SCALE);
      this.ctx.translate(coordinate.x / this.SCALE - this.OFFSET, coordinate.y / this.SCALE - this.OFFSET);
      this.ctx.rotate(225 * Math.PI / 180);
      this.ctx.fill(SVG_PATH);
      // .restore(): Canvas 2D API restores the most recently saved canvas state
      this.ctx.restore();
    });
  }

  clear() {
    // clear the canvas area
    this.ctx.clearRect( 0,0, this.canvasObj.width, this.canvasObj.height);
  }
}