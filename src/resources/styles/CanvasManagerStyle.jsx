import colors from 'resources/Colors.js'

const canvasManagerStyle = theme => ({

  container: {
    width: '100%',
    height: '0',
    paddingBottom: '56.25%', // 16:9
  },

  canvas: {
    backgroundColor: 'black',
  },
})

export default canvasManagerStyle;