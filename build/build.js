import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "index.js",
  output: {
    file: 'dist/toy-widget.js',
    format: 'es',
    name: 'ToyWidget'
  },
  plugins: [commonjs(), resolve()]
}