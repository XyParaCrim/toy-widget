# Toy-Widget
[![codebeat badge](https://codebeat.co/badges/d2b4b94b-8c27-41e5-8485-e4133c29361b)](https://codebeat.co/projects/github-com-xyparacrim-toy-widget-master)

## Feature
一套用于构建各式各样图形编辑器的基本框架。

- [anrajs](https://github.com/anrainie/anrajs/tree/master/modules/aditor-svg) - toy-widget + svg流程图编辑器，提供拖、连线、快捷键、事件处理、图形绘制、选择监听等一系列编辑器功能。

### Flexible Feature
程序是由一个个部件(Widget)对象组合而成，而部件的特性(feature)完全可以根据开发者想法自己定制。当然，内置了一些流程图的相关特性：

- 组件化(composable)
- 响应式(reactive)
- 事件机制(emitter)
- 命令模式(commander)
- 选择监听(selection)
- 策略模式(policy)
- 工具模式(tool)
- 虚拟事件(tracker)
- 虚拟节点结构(children)
- 数据绑定(model)
- 。。。

以上内置部件特性也完全是热插拔的。

### Fully Configurable
- 部件配置化：每个部件的实现都是以完全配置化为目标，即必须通过配置选项(options)实例化
- 特性配置化：配置新的特性，产生新的编辑器框架

### Simple Lifecycle Template
[为部件生命周期的状态改变、运转提供一个易于理解和普遍适用的模板](https://www.draw.io/?lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Untitled%20Diagram.drawio#R3VhNc9owEP01OpKxbPx1xGDSQzOTTg5tThmBha3GWK4QAfLrK9kytrEgbkoKjS9ITyt5tfvergdgjZfbW4by5I5GOAWmEW2BNQGmCaFrih%2BJ7ErENWAJxIxEyqgGHsgrVqCh0DWJ8KplyClNOcnb4JxmGZ7zFoYYo5u22YKm7bfmKMYd4GGO0i76nUQ8qe7l%2BPXCF0ziRL3aM51yYYbmzzGj60y9D5jWonjK5SWqzlIXXSUoopsGZIXAGjNKeTlabsc4lbGtwlbumx5Z3fvNcMb7bLDLDS8oXePK48IvvqtiITaIsItJIJzNJbjiiPEHjrgEFyRNxzSlrLC2jOKRxpzRZ9xYWSzUStdH5fYLZhxvG5Dy%2BRbTJeZsJ0yqVUPFT%2FHLUdNNnSxLQUkjTRWGFD3i%2FcF1iMRARUkfMadHxCJBJjXF6YxuwhoICkAsJJSRV5pxJF4UyJsTQb9RSuJMLM4o53QprbNoJPksMJrjrESUXjxdlKdTFWVhNyXyFhMoZgUlsbyCcTT8K7pmc9zihUh0jJWVW0Lycn1SZDrDG7uVJOh4x8OvzrmnRHhVH%2BL6B4eY1sEhpYtq30Ea9171yuwUj8PR0%2BsM0V9Pu%2Fzu%2FnH2bTsYwm6%2BQxt4HvAncjBygRcUyBj4TocKgs8ifEHCl%2FtM4BV5RbPCQOYpl54Xd7EDYE8EghQJ5iJBmGnYsSRRVHApRTOcBvuS0xJbUXQqsXWUtS%2BdypO6IjWJ4egzzHCKOHlp18r%2BSR1Aq72FLhYr%2FLfZc7V5ClwQ%2FFHCzlCc9l1MUdbuFicINdXJPkN18ntUp05J%2Bagi4naLiNeziPSmWN%2FA6MVtHhV3QZEgAMHok2naP8ld4wY6jsrbe2V%2BVlnr8%2Bae7LmU8YTGNENps%2FE22WsFtc1XSnOVx5%2BY853qrmjNaTvLeEv4D7ldtKRy9qgOk%2BPJtjnZVZNM3LSxSU4fm2v1tmJW7dPK5E3BeUe69sX0pSlHoQN8E4yGIPSBPwSe0Unl%2F62vE4Q9oTrD8A%2B%2Bc65Ig97brfVEuTxDR7W8y3VUqPkAvFxL1Si8uvi19FRLq%2FlgKqUuB0PJk8%2BleXiavgPjxhLPFSlan7nh9XRV%2BK6uCj%2Bkq1YC63zHXkxi%2BoLsQeCPQejKtjryPpnETjD2lO46fXUAr0iGFbP0nfXNonmGzmrb%2F6yzimn9v2YZrPrPYyv8DQ%3D%3D)

## Installation

```bash
npm install toy-widget
```

### How to use

定义一个名叫Node的新部件，并添加默认选项name；然后为Node添加支持name和size选项的特性

```js
import ToyWidget from 'toy-widget'

ToyWidget.Widget.define('Node', { name: 'good-node' })
ToyWidget.Widget.feature('Node', {
  // 定义支持的选项
  options: {
    name: {
      merge: 'replay', // name选项是如何合并的
      build(nodeWidget, option) {
        nodeWidget.name = option
      }  
    },
    size: {
      build(nodeWidget, option) {
        nodeWidget.size = option
      } 
    } 
  },

  defaults: {
    size: 16, // 定义选项size的默认值

    // on选项是由emitter特性支持，提供简单的事件机制
    on: {
      create() {
        this.emit('customEvent')
      },
      customEvent() {
        console.log(this.getNameAndSize())
      }
    } 
  },

  // 给该部件添加一些方法
  mixin: {
    getNameAndSize() {
      return this.name + "-" + this.size
    }
  }
})
```
创建不同的Node部件
```js
let defaultNode = ToyWidget.Widget.of('Node')
defaultNode.getNameAndSize() //"good-node-16"

let badNode = ToyWidget.Widget.of('Node', {name: 'bad-node', size: '17'})
badNode.getNameAndSize() // "bad-node-17"
```

