import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "index.js",
  output: {
    file: '../aditor/node_modules/toy-widget/dist/toy-widget.js',
    format: 'es',
    name: 'Aditor'
  },
  plugins: [commonjs(), resolve()]
}