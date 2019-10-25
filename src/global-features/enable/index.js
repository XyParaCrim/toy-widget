export default function enableFeature() {
  return {
    name: 'enable',

    mixin: {
      disableEvent() {
        this.style['pointer-events'] = 'none'
      },
      enableEvent() {
        this.style['pointer-events'] = this.options.get('defaultEvent') || 'visible'
      }
    }
  }
}
