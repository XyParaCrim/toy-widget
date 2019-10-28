# Toy-Widget
[![codebeat badge](https://codebeat.co/badges/d2b4b94b-8c27-41e5-8485-e4133c29361b)](https://codebeat.co/projects/github-com-xyparacrim-toy-widget-master)

## Feature
一套用于构建图形编辑器的基本框架。开发者可以根据自己的想法，添加自己的数据响应式、状态管理、事件响应等等；选择图形绘画方式...以下是实现的一些编辑器框架：

- [anrajs - toy-widget + svg流程图编辑器，提供拖、连线、快捷键、事件处理、图形绘制、选择监听等一系列编辑器功能。](https://github.com/anrainie/anrajs)

### Flexible Feature
程序是由一个个部件(Widget)对象组合而成，而部件的特性([feature](#Features))完全可以根据开发者想法自己定制。当然，内置了一些流程图的相关特性：

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
- 操作模式(operator)
- 。。。

以上内置部件特性也完全是热插拔的。

### Fully Configurable
- 部件配置化：每个部件的实现都是以完全配置化为目标，即必须通过配置选项([options](#Options))实例化
- 特性配置化：配置新的特性，产生新的编辑器框架

### Simple Lifecycle Template
[为部件生命周期的状态改变、运转提供一个易于理解和普遍适用的模板](https://www.draw.io/?lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Untitled%20Diagram.drawio#R3VhNc9owEP01OpKxbPx1xGDSQzOTTg5tThmBha3GWK4QAfLrK9kytrEgbkoKjS9ITyt5tfvergdgjZfbW4by5I5GOAWmEW2BNQGmCaFrih%2BJ7ErENWAJxIxEyqgGHsgrVqCh0DWJ8KplyClNOcnb4JxmGZ7zFoYYo5u22YKm7bfmKMYd4GGO0i76nUQ8qe7l%2BPXCF0ziRL3aM51yYYbmzzGj60y9D5jWonjK5SWqzlIXXSUoopsGZIXAGjNKeTlabsc4lbGtwlbumx5Z3fvNcMb7bLDLDS8oXePK48IvvqtiITaIsItJIJzNJbjiiPEHjrgEFyRNxzSlrLC2jOKRxpzRZ9xYWSzUStdH5fYLZhxvG5Dy%2BRbTJeZsJ0yqVUPFT%2FHLUdNNnSxLQUkjTRWGFD3i%2FcF1iMRARUkfMadHxCJBJjXF6YxuwhoICkAsJJSRV5pxJF4UyJsTQb9RSuJMLM4o53QprbNoJPksMJrjrESUXjxdlKdTFWVhNyXyFhMoZgUlsbyCcTT8K7pmc9zihUh0jJWVW0Lycn1SZDrDG7uVJOh4x8OvzrmnRHhVH%2BL6B4eY1sEhpYtq30Ea9171yuwUj8PR0%2BsM0V9Pu%2Fzu%2FnH2bTsYwm6%2BQxt4HvAncjBygRcUyBj4TocKgs8ifEHCl%2FtM4BV5RbPCQOYpl54Xd7EDYE8EghQJ5iJBmGnYsSRRVHApRTOcBvuS0xJbUXQqsXWUtS%2BdypO6IjWJ4egzzHCKOHlp18r%2BSR1Aq72FLhYr%2FLfZc7V5ClwQ%2FFHCzlCc9l1MUdbuFicINdXJPkN18ntUp05J%2Bagi4naLiNeziPSmWN%2FA6MVtHhV3QZEgAMHok2naP8ld4wY6jsrbe2V%2BVlnr8%2Bae7LmU8YTGNENps%2FE22WsFtc1XSnOVx5%2BY853qrmjNaTvLeEv4D7ldtKRy9qgOk%2BPJtjnZVZNM3LSxSU4fm2v1tmJW7dPK5E3BeUe69sX0pSlHoQN8E4yGIPSBPwSe0Unl%2F62vE4Q9oTrD8A%2B%2Bc65Ig97brfVEuTxDR7W8y3VUqPkAvFxL1Si8uvi19FRLq%2FlgKqUuB0PJk8%2BleXiavgPjxhLPFSlan7nh9XRV%2BK6uCj%2Bkq1YC63zHXkxi%2BoLsQeCPQejKtjryPpnETjD2lO46fXUAr0iGFbP0nfXNonmGzmrb%2F6yzimn9v2YZrPrPYyv8DQ%3D%3D)

## Installation

```bash
npm install toy-widget
```

## How to toy
1. 定义一个名叫Node的新部件，并添加默认选项name
2. 为Node添加支持name和size选项的特性

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
## Important Conception

### Options

用于实例化部件的唯一输入(一个部件支持哪些Options是由其组成的Features决定的)，以下是一些通用内置特性(Feature)支持的选项(Options)：

| Option                   | Default              |      Feature              |  Description |
| ------------------------ | -------------------- | ------------------------- | ------------------------- |
| `on`                     | `{}`                 | `emitter`                 |  注册部件事件               |
| `class`                  | `''`                 | `styleable`               |  Dom class绑定             |
| `style`                  | `{}`                 | `styleable`               |  Dom style绑定             |
| `attr`                   | `{}`                 | `styleable`               |  Dom attribute绑定         |
| `createElement`          | `noop`               | `element`                 |  创建Dom方法               |
| `composite`              | `{}`                 | `composable`              |  定义部件之间的组合方式      |
| `separate`               | `{}`                 | `composable`              |  定义部件之间的分离方式      |
| `model`                  | `null`               | `model`                   |  数据绑定                   |
| `policies`               | `{}`                 | `policy`                  |  注册部件策略(特性Policy提供策略机制) |
| `visual`                 | `{}`                 | `visual`                  |  定义视图的渲染方式          |
| `createTracker`          | `{}`                 | `tracker`                 |  定义部件如果处理和传递虚拟事件 |
| `operation`              | `{}`                 | `operator`                |  注册快捷键等               |
| `tool`                   | `{}`                 | `tool`                    |  注册部件工具(特性Tool提供的工具机制) |

### Features

用于构建不同类型部件的元素，以下是根据编辑器需要内置的特性：

| Feature                  | Supported Widgets             |  Description |
| -------------------------| ------------------------------| ------------ |
| `emitter`                | `*`                           | 事件机制      |
| `styleable`              | `*`                           | Dom样式绑定   |
| `commander`              | `Canvas`                      | 处理命令，支持基本命令功能，如撤销、重做等等|
| `element`                | `*`                           | 关于部件与Dom的关系(内置实现：简单地一对一绑定，创建，销毁等)
| `composable`             | `*`                           | 定义关于部件与部件之间的关系
| `selection`              | `Canvas`                      | 管理选择处理
| `selected`               | `EditPart`                    | 成为一个可选择部件，并通知selection部件
| `display`                | `Canvas`                      | 真实事件与虚拟事件之间的转换
| `display-element`        | `EditPart`                    | 具备接受虚拟事件的能力
| `event-bus`              | `Canvas`                      | 事件总线，定义如何分发事件
| `operator`               | `Canvas`                      | 用于快捷键、右键菜单等
| `tool`                   | `Canvas`                      | 工具机制(将相应的操作处理抽象)
| `model`                  | `EditPart`                    | 数据绑定
| `policy`                 | `EditPart`                    | 策略模式
| `children`               | `EditPart`                    | 通过响应数据变化，管理虚拟节点结构
| `composite`              | `EditPart`                    | 提供部件的查询API
| `hash`                   | `EditPart`                    | 映射部件对象，主要用于查询
| `tracker`                | `EditPart`                    | 定义部件如果处理和传递虚拟事件
| `visual`                 | `EditPart`                    | 定义视图的渲染方式
| `handle-visual`          | `Handle`                      | 特殊的视图的渲染方式


