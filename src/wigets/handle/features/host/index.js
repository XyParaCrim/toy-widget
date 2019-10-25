export default function hostFeature () {
  return {
    name: 'host-feature',

    options: {
      host: {
        build(handle, host) {
          handle.host = host
        }
      }
    }
  }
}