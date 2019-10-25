import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "index.js",
  output: {
    file: 'dist/aditor.es.js',
    format: 'es',
    name: 'Aditor'
  },
  plugins: [commonjs(), resolve()]
}